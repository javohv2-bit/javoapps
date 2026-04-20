/**
 * Mailings Dashboard Data Service
 * 
 * Gestiona datos de campañas de email marketing
 * Conecta con Supabase para:
 * - Almacenar archivos Excel/PDF/CSV
 * - Procesar métricas de campañas
 * - Calcular resúmenes mensuales y anuales
 */

import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

const STORAGE_BUCKET = 'mailings-files';

/**
 * Subir archivo Excel y procesar datos históricos
 */
export const uploadExcelFile = async (file) => {
    try {
        const timestamp = Date.now();
        const fileName = `excel/${timestamp}_${file.name}`;
        
        // 1. Subir a Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Leer y procesar Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        
        // 3. Registrar archivo
        const { data: fileRecord, error: fileError } = await supabase
            .from('mailings_files')
            .insert({
                file_name: file.name,
                file_type: 'excel',
                file_path: fileName,
                status: 'uploaded'
            })
            .select()
            .single();

        if (fileError) throw fileError;

        // 4. Procesar hojas del Excel
        await processExcelSheets(workbook, fileRecord.id);

        return { success: true, fileId: fileRecord.id };
    } catch (error) {
        console.error('Error uploading Excel:', error);
        throw error;
    }
};

/**
 * Procesar hojas del Excel (2021-2024)
 */
const processExcelSheets = async (workbook, fileId) => {
    const years = [2021, 2022, 2023, 2024];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (const year of years) {
        try {
            const sheetName = `Annual Summary ${year}`;
            if (!workbook.Sheets[sheetName]) continue;

            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const monthlyData = [];
            let yearlyTotals = {
                successful_deliveries: 0,
                opened: 0,
                total_opens: 0,
                people_clicked: 0,
                total_clicks: 0,
                users: 0,
                transactions: 0,
                revenue: 0
            };

            // Procesar filas 2-13 (meses)
            for (let i = 2; i <= 13 && i < data.length; i++) {
                const row = data[i];
                const month = monthNames[i - 2];

                const monthData = {
                    year,
                    month,
                    successful_deliveries: cleanNumber(row[1]),
                    opened: cleanNumber(row[2]),
                    total_opens: cleanNumber(row[4]),
                    people_clicked: cleanNumber(row[5]),
                    total_clicks: cleanNumber(row[8]),
                    users: cleanNumber(row[9]),
                    transactions: cleanNumber(row[10]),
                    revenue: cleanNumber(row[12])
                };

                // Calcular tasas
                const sd = monthData.successful_deliveries;
                const op = monthData.opened;
                monthData.open_rate = sd > 0 ? op / sd : 0;
                monthData.click_rate_opened = op > 0 ? monthData.people_clicked / op : 0;
                monthData.click_rate_delivered = sd > 0 ? monthData.people_clicked / sd : 0;

                monthlyData.push(monthData);

                // Acumular totales anuales
                Object.keys(yearlyTotals).forEach(key => {
                    yearlyTotals[key] += monthData[key] || 0;
                });
            }

            // Guardar resúmenes mensuales
            const { error: monthlyError } = await supabase
                .from('monthly_summaries')
                .upsert(monthlyData, { onConflict: 'year,month' });

            if (monthlyError) throw monthlyError;

            // Calcular tasas anuales
            const sd = yearlyTotals.successful_deliveries;
            const op = yearlyTotals.opened;
            yearlyTotals.open_rate = sd > 0 ? op / sd : 0;
            yearlyTotals.click_rate_opened = op > 0 ? yearlyTotals.people_clicked / op : 0;
            yearlyTotals.click_rate_delivered = sd > 0 ? yearlyTotals.people_clicked / sd : 0;

            // Guardar resumen anual
            const { error: yearlyError } = await supabase
                .from('yearly_summaries')
                .upsert({ year, ...yearlyTotals });

            if (yearlyError) throw yearlyError;

        } catch (error) {
            console.error(`Error processing year ${year}:`, error);
        }
    }

    // Actualizar status del archivo
    await supabase
        .from('mailings_files')
        .update({ status: 'processed' })
        .eq('id', fileId);
};

/**
 * Subir CSV de campaña mensual (2025)
 */
export const uploadCSVCampaign = async (file, year, month) => {
    try {
        const timestamp = Date.now();
        const fileName = `csv/${year}/${month}_${timestamp}.csv`;
        
        // 1. Subir a Storage
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Leer CSV
        const text = await file.text();
        const workbook = XLSX.read(text, { type: 'string' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // 3. Registrar archivo
        const { data: fileRecord, error: fileError } = await supabase
            .from('mailings_files')
            .insert({
                file_name: file.name,
                file_type: 'csv',
                file_path: fileName,
                year,
                month,
                status: 'uploaded'
            })
            .select()
            .single();

        if (fileError) throw fileError;

        // 4. Procesar campañas
        const campaigns = data.map(row => ({
            year,
            month,
            campaign_name: row['Campaign'] || row['Campaña'] || '',
            subject: row['Subject'] || row['Asunto'] || '',
            date: parseDate(row['Date'] || row['Fecha']),
            sends: cleanNumber(row['Sends'] || row['Envíos']),
            successful_deliveries: cleanNumber(row['Deliveries'] || row['Entregas']),
            opened: cleanNumber(row['Opens'] || row['Aperturas']),
            people_clicked: cleanNumber(row['Clicks'] || row['Clics']),
            revenue: cleanNumber(row['Revenue'] || row['Ingresos']),
            users: cleanNumber(row['Users'] || row['Usuarios']),
            transactions: cleanNumber(row['Transactions'] || row['Transacciones'])
        }));

        // 5. Insertar campañas
        const { error: campaignsError } = await supabase
            .from('campaigns')
            .insert(campaigns);

        if (campaignsError) throw campaignsError;

        // 6. Actualizar archivo como procesado
        await supabase
            .from('mailings_files')
            .update({ status: 'processed' })
            .eq('id', fileRecord.id);

        // 7. Recalcular resúmenes
        await recalculateSummaries(year, month);

        return { success: true, campaignsCount: campaigns.length };
    } catch (error) {
        console.error('Error uploading CSV:', error);
        throw error;
    }
};

/**
 * Recalcular resúmenes mensuales y anuales
 */
const recalculateSummaries = async (year, month) => {
    try {
        // 1. Obtener campañas del mes
        const { data: campaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('*')
            .eq('year', year)
            .eq('month', month);

        if (campaignsError) throw campaignsError;

        if (!campaigns || campaigns.length === 0) return;

        // 2. Calcular totales mensuales
        const monthlyTotals = {
            year,
            month,
            successful_deliveries: 0,
            opened: 0,
            total_opens: 0,
            people_clicked: 0,
            total_clicks: 0,
            users: 0,
            transactions: 0,
            revenue: 0
        };

        campaigns.forEach(c => {
            monthlyTotals.successful_deliveries += c.successful_deliveries || 0;
            monthlyTotals.opened += c.opened || 0;
            monthlyTotals.people_clicked += c.people_clicked || 0;
            monthlyTotals.users += c.users || 0;
            monthlyTotals.transactions += c.transactions || 0;
            monthlyTotals.revenue += parseFloat(c.revenue) || 0;
        });

        // Calcular tasas
        const sd = monthlyTotals.successful_deliveries;
        const op = monthlyTotals.opened;
        monthlyTotals.open_rate = sd > 0 ? op / sd : 0;
        monthlyTotals.click_rate_opened = op > 0 ? monthlyTotals.people_clicked / op : 0;
        monthlyTotals.click_rate_delivered = sd > 0 ? monthlyTotals.people_clicked / sd : 0;

        // 3. Guardar resumen mensual
        await supabase
            .from('monthly_summaries')
            .upsert(monthlyTotals, { onConflict: 'year,month' });

        // 4. Recalcular totales anuales
        const { data: allMonthly, error: monthlyError } = await supabase
            .from('monthly_summaries')
            .select('*')
            .eq('year', year);

        if (monthlyError) throw monthlyError;

        const yearlyTotals = {
            year,
            successful_deliveries: 0,
            opened: 0,
            total_opens: 0,
            people_clicked: 0,
            total_clicks: 0,
            users: 0,
            transactions: 0,
            revenue: 0
        };

        allMonthly.forEach(m => {
            yearlyTotals.successful_deliveries += m.successful_deliveries || 0;
            yearlyTotals.opened += m.opened || 0;
            yearlyTotals.people_clicked += m.people_clicked || 0;
            yearlyTotals.users += m.users || 0;
            yearlyTotals.transactions += m.transactions || 0;
            yearlyTotals.revenue += parseFloat(m.revenue) || 0;
        });

        // Calcular tasas anuales
        const sdYear = yearlyTotals.successful_deliveries;
        const opYear = yearlyTotals.opened;
        yearlyTotals.open_rate = sdYear > 0 ? opYear / sdYear : 0;
        yearlyTotals.click_rate_opened = opYear > 0 ? yearlyTotals.people_clicked / opYear : 0;
        yearlyTotals.click_rate_delivered = sdYear > 0 ? yearlyTotals.people_clicked / sdYear : 0;

        // 5. Guardar resumen anual
        await supabase
            .from('yearly_summaries')
            .upsert(yearlyTotals);

    } catch (error) {
        console.error('Error recalculating summaries:', error);
    }
};

/**
 * Obtener resúmenes anuales
 */
export const getYearlySummaries = async () => {
    const { data, error } = await supabase
        .from('yearly_summaries')
        .select('*')
        .order('year', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener resúmenes mensuales de un año
 */
export const getMonthlySummaries = async (year) => {
    const { data, error } = await supabase
        .from('monthly_summaries')
        .select('*')
        .eq('year', year)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener campañas de un mes específico
 */
export const getCampaigns = async (year, month) => {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('year', year)
        .eq('month', month)
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener estadísticas generales
 */
export const getStats = async () => {
    try {
        const { data: campaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id');

        const { data: files, error: filesError } = await supabase
            .from('mailings_files')
            .select('id');

        if (campaignsError || filesError) throw campaignsError || filesError;

        return {
            totalCampaigns: campaigns?.length || 0,
            totalFiles: files?.length || 0
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { totalCampaigns: 0, totalFiles: 0 };
    }
};

/**
 * Eliminar archivo y datos asociados
 */
export const deleteFile = async (fileId) => {
    try {
        // 1. Obtener info del archivo
        const { data: file, error: fileError } = await supabase
            .from('mailings_files')
            .select('*')
            .eq('id', fileId)
            .single();

        if (fileError) throw fileError;

        // 2. Eliminar de Storage
        const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([file.file_path]);

        if (storageError) throw storageError;

        // 3. Eliminar registro
        const { error: deleteError } = await supabase
            .from('mailings_files')
            .delete()
            .eq('id', fileId);

        if (deleteError) throw deleteError;

        return { success: true };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

// ============================================
// HELPERS
// ============================================

function cleanNumber(value) {
    if (!value) return 0;
    const str = String(value).replace(/[,$]/g, '').trim();
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
}

function parseDate(value) {
    if (!value) return null;
    try {
        // Intentar parsear diferentes formatos de fecha
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    } catch {
        return null;
    }
}

/**
 * Obtener todas las campañas de un año (para estadísticas de DB)
 */
export const getAllCampaignsForYear = async (year) => {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('year', year);

    if (error) throw error;
    return data || [];
};
