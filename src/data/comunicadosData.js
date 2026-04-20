/**
 * Comunicados Data Service
 * 
 * Gestiona la base de datos de comunicados de productos
 * Conecta con Supabase para:
 * - Almacenar archivos Excel y PDF en Storage
 * - Guardar metadata en tabla
 * - Generar y almacenar HTMLs
 */

import { supabase, supabaseAdmin } from '../lib/supabase';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker de PDF.js - usar worker inline para evitar problemas de carga
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const TABLE_NAME = 'comunicados';
const STORAGE_BUCKET = 'comunicados-files';

/**
 * Obtener todos los comunicados
 * @returns {Promise<Array>} Lista de comunicados
 */
export const getComunicados = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching comunicados:', error);
        return [];
    }
};

/**
 * Subir archivo Excel y crear comunicado
 * @param {File} file - Archivo Excel
 * @param {string} productName - Nombre del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
export const uploadExcelAndCreate = async (file, productName) => {
    try {
        // 1. Subir Excel a Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const excelPath = `excels/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(excelPath, file, {
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                upsert: false
            });

        if (uploadError) throw new Error(`Error subiendo Excel: ${uploadError.message}`);

        // 2. Leer y procesar el Excel
        const excelData = await processExcelFile(file);

        // 3. Crear registro en la tabla
        const { data: comunicado, error: dbError } = await supabase
            .from(TABLE_NAME)
            .insert({
                name: productName,
                excel_path: excelPath,
                excel_data: excelData,
                status: 'pending',
                html_path: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (dbError) throw new Error(`Error creando registro: ${dbError.message}`);

        return { success: true, data: comunicado };
    } catch (error) {
        console.error('Error uploading Excel:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Procesar archivo Excel y extraer datos
 * @param {File} file - Archivo Excel
 * @returns {Promise<Object>} Datos extraídos
 */
const processExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // Extraer información clave del Excel
                const extractedData = {
                    type: 'excel',
                    title: null,
                    moduleHeader: null,
                    fields: []
                };

                jsonData.forEach((row, index) => {
                    if (!row || row.length === 0) return;

                    // Buscar título (usualmente en columna B, con "=")
                    if (row[1] && typeof row[1] === 'string' && row[1].includes('=') && !extractedData.title && index < 10) {
                        extractedData.title = row[1];
                    }

                    // Buscar module header (columna C con "=")
                    if (row[2] && typeof row[2] === 'string' && row[2].includes('=') && !extractedData.moduleHeader && !row[1]) {
                        extractedData.moduleHeader = row[2];
                    }

                    // Extraer pares etiqueta-valor (B-C-D)
                    if (row[1] && typeof row[1] === 'string') {
                        const label = row[1].trim().replace(/^-/, '').replace(/:$/, '').trim();
                        if (label && label.length > 0) {
                            extractedData.fields.push({
                                label: label,
                                value: row[2] ? String(row[2]).trim() : '',
                                page: row[3] ? String(row[3]).trim() : ''
                            });
                        }
                    }
                });

                resolve(extractedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Error leyendo archivo'));
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Subir archivo PDF y crear comunicado
 * @param {File} file - Archivo PDF
 * @param {string} productName - Nombre del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
export const uploadPDFAndCreate = async (file, productName) => {
    try {
        // 1. Subir PDF a Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const pdfPath = `pdfs/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(pdfPath, file, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) throw new Error(`Error subiendo PDF: ${uploadError.message}`);

        // 2. Leer y procesar el PDF
        const pdfData = await processPDFFile(file);

        // 3. Crear registro en la tabla
        const { data: comunicado, error: dbError } = await supabase
            .from(TABLE_NAME)
            .insert({
                name: productName,
                excel_path: pdfPath, // Usar mismo campo pero con PDF
                excel_data: pdfData,
                status: 'pending',
                html_path: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (dbError) throw new Error(`Error creando registro: ${dbError.message}`);

        return { success: true, data: comunicado };
    } catch (error) {
        console.error('Error uploading PDF:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Procesar archivo PDF y extraer datos
 * @param {File} file - Archivo PDF
 * @returns {Promise<Object>} Datos extraídos
 */
const processPDFFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                
                // Usar API nativa del navegador para extraer texto del PDF
                const text = await extractTextFromPDFBuffer(arrayBuffer);
                
                // Parsear el texto extraído
                const extractedData = parsePDFText(text);
                
                resolve(extractedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Error leyendo archivo PDF'));
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Extraer texto de un buffer de PDF usando pdf.js
 * @param {ArrayBuffer} arrayBuffer - Buffer del PDF
 * @returns {Promise<string>} Texto extraído
 */
const extractTextFromPDFBuffer = async (arrayBuffer) => {
    try {
        // Cargar el documento PDF
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        
        // Extraer texto de cada página
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Concatenar todos los items de texto
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');
            
            fullText += pageText + '\n';
        }
        
        console.log('Texto extraído del PDF:', fullText.substring(0, 500));
        return fullText;
    } catch (error) {
        console.error('Error extrayendo texto del PDF:', error);
        throw new Error('Error extrayendo texto del PDF: ' + error.message);
    }
};

/**
 * Parsear texto extraído del PDF (certificado SUBTEL)
 * Soporta múltiples formatos de certificados SUBTEL
 * @param {string} text - Texto del PDF
 * @returns {Object} Datos estructurados
 */
const parsePDFText = (text) => {
    const extractedData = {
        type: 'pdf',
        documentType: 'Certificado SUBTEL',
        fullText: text,
        ordNumber: '',
        date: '',
        from: 'SUBSECRETARÍA DE TELECOMUNICACIONES',
        to: '',
        subject: 'Certifica equipos de alcance reducido',
        equipmentData: {
            tipo: '',
            marca: '',
            modelo: '',
            fabricante: '',
            frecuencias: '',
            potencia: '',
            restricciones: ''
        }
    };

    // Normalizar texto - quitar espacios múltiples
    const t = text.replace(/\s+/g, ' ');

    // === EXTRAER DATOS DEL EQUIPO ===
    // Detectar formato de tabla (REBEL T100, T7, G7X MK III, SX740)
    // Formato tabla: "Tipo de Equipo Marca Modelo Fabricante Frecuencias..."
    const isTableFormat = /Tipo de Equipo\s+Marca\s+Modelo\s+Fabricante/i.test(t);
    
    if (isTableFormat) {
        // Formato tabla - buscar valores después de los headers
        const tableMatch = t.match(/Potencia\s+m[aá]xima\s+radiada\s+(.+?)(?:\d+\.\s+El incumpl|$)/i);
        if (tableMatch) {
            const values = tableMatch[1].trim();
            // Extraer valores separados por punto
            const parts = values.split(/\.\s*/).filter(p => p.trim());
            if (parts.length >= 6) {
                extractedData.equipmentData.tipo = parts[0]?.trim() || '';
                extractedData.equipmentData.marca = parts[1]?.trim() || '';
                extractedData.equipmentData.modelo = parts[2]?.trim() || '';
                extractedData.equipmentData.fabricante = parts[3]?.trim() || '';
                // Frecuencias y potencia pueden estar juntas
                const freqPot = parts.slice(4).join('. ');
                const freqMatch = freqPot.match(/([\d\-,;\s]+MHz)/i);
                if (freqMatch) {
                    extractedData.equipmentData.frecuencias = freqMatch[1].trim();
                    const afterFreq = freqPot.substring(freqPot.indexOf(freqMatch[1]) + freqMatch[1].length);
                    extractedData.equipmentData.potencia = afterFreq.replace(/^[\s\.]+/, '').trim();
                }
            }
        }
    } else {
        // Formatos estándar con separadores
        
        // Tipo de equipo - múltiples formatos
        let tipoMatch = t.match(/(?:-\s*)?Tipo\s+de\s+[Ee]quipo\s*:?\s*([^-]+?)(?=\s+(?:-\s*)?Marca\s)/i);
        if (tipoMatch) extractedData.equipmentData.tipo = tipoMatch[1].trim().replace(/\.$/, '').trim();

        // Marca
        let marcaMatch = t.match(/(?:-\s*)?Marca\s*:?\s*([A-Za-z]+)[\s\.]*(?=(?:-\s*)?Modelo)/i);
        if (marcaMatch) extractedData.equipmentData.marca = marcaMatch[1].trim();

        // Modelo - puede tener (s) y múltiples valores
        let modeloMatch = t.match(/(?:-\s*)?Modelo\(?s?\)?\s*:?\s*([A-Za-z0-9\-\s,]+?)(?=\s+(?:-\s*)?Fabricante)/i);
        if (modeloMatch) extractedData.equipmentData.modelo = modeloMatch[1].trim().replace(/\.$/, '').trim();

        // Fabricante
        let fabMatch = t.match(/(?:-\s*)?Fabricante\s*:?\s*([A-Za-z\s\.\(\)]+?)(?=\s+(?:-\s*)?Frecuencia)/i);
        if (fabMatch) extractedData.equipmentData.fabricante = fabMatch[1].trim().replace(/\.$/, '').trim();

        // Frecuencias de operación
        let frecMatch = t.match(/(?:-\s*)?Frecuencias?\s+de\s+operaci[oó]n\s*:?\s*(.+?)(?=\s+(?:-\s*)?Potencia)/i);
        if (frecMatch) extractedData.equipmentData.frecuencias = frecMatch[1].trim().replace(/\.$/, '').trim();

        // Potencia máxima radiada
        let potMatch = t.match(/(?:-\s*)?Potencia\s+m[aá]xima\s+radiada?\s*:?\s*(.+?)(?=\s+(?:-\s*)?Restriccion|\s+2\.|\s+3\.)/i);
        if (potMatch) extractedData.equipmentData.potencia = potMatch[1].trim().replace(/\.$/, '').trim();

        // Restricciones - varios finales posibles
        let restMatch = t.match(/(?:-\s*)?Restricciones?(?:\s+de\s+uso)?\s*:?\s*(.+?)(?=\s+\d+\.\s+El incumpl|\s+2\.\s+El incumpl|\s+3\.\s+El incumpl)/i);
        if (restMatch) extractedData.equipmentData.restricciones = restMatch[1].trim().replace(/\.$/, '').trim();
    }

    // Si Restricciones está vacío o es solo "-", limpiar
    if (extractedData.equipmentData.restricciones === '-' || extractedData.equipmentData.restricciones === '') {
        extractedData.equipmentData.restricciones = 'Sin restricciones específicas';
    }

    return extractedData;
};

/**
 * Generar HTML a partir de un comunicado
 * @param {number} comunicadoId - ID del comunicado
 * @returns {Promise<Object>} Resultado de la operación
 */
export const generateHTML = async (comunicadoId) => {
    try {
        // 1. Obtener el comunicado
        const { data: comunicado, error: fetchError } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', comunicadoId)
            .single();

        if (fetchError) throw new Error(`Error obteniendo comunicado: ${fetchError.message}`);

        // 2. Generar HTML según el tipo de datos
        let htmlContent;
        if (comunicado.excel_data.type === 'pdf') {
            htmlContent = generateHTMLFromPDFData(comunicado.excel_data, comunicado.name);
        } else {
            htmlContent = generateHTMLFromData(comunicado.excel_data, comunicado.name);
        }

        // 3. Subir HTML a Storage
        const htmlPath = `htmls/${comunicado.name}_${Date.now()}.html`;
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

        const { error: uploadError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(htmlPath, htmlBlob, {
                contentType: 'text/html',
                upsert: false
            });

        if (uploadError) throw new Error(`Error subiendo HTML: ${uploadError.message}`);

        // 4. Actualizar registro con el path del HTML
        const { error: updateError } = await supabase
            .from(TABLE_NAME)
            .update({
                html_path: htmlPath,
                status: 'generated',
                updated_at: new Date().toISOString()
            })
            .eq('id', comunicadoId);

        if (updateError) throw new Error(`Error actualizando registro: ${updateError.message}`);

        return { success: true, htmlPath };
    } catch (error) {
        console.error('Error generating HTML:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Generar contenido HTML desde los datos extraídos
 * @param {Object} excelData - Datos extraídos del Excel
 * @param {string} productName - Nombre del producto
 * @returns {string} Contenido HTML
 */
const generateHTMLFromData = (excelData, productName) => {
    const { title, moduleHeader, fields } = excelData;

    // Generar filas de la tabla
    const tableRows = fields.map(field => `
        <tr>
            <td>${field.label}</td>
            <td>${field.value}</td>
            <td>${field.page}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || productName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .text-align-center {
            text-align: center;
        }
        h4 {
            color: #333;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <p class="text-align-center"><strong>${title || productName}</strong></p>
    ${moduleHeader ? `<h4>${moduleHeader}</h4>` : ''}
    <table>
        ${tableRows}
    </table>
</body>
</html>`;
};

/**
 * Generar contenido HTML desde datos de PDF (Certificado SUBTEL)
 * Formato formal/clásico igual que el Excel
 * @param {Object} pdfData - Datos extraídos del PDF
 * @param {string} productName - Nombre del producto
 * @returns {string} Contenido HTML
 */
const generateHTMLFromPDFData = (pdfData, productName) => {
    const { ordNumber, date, from, to, subject, equipmentData = {} } = pdfData;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Certificado SUBTEL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .text-align-center {
            text-align: center;
        }
        h3, h4 {
            color: #333;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <p class="text-align-center">
        <strong>${equipmentData.modelo || productName}${ordNumber ? ' = ORD. N° ' + ordNumber : ''}</strong>
    </p>
    <p>
        <br>
        &nbsp;
    </p>
    
    <h3 class="text-align-center">
        A. Información comercial del equipo y del fabricante o importador en Chile
    </h3>
    <table class="table">
        <tbody>
            ${date ? `<tr><td><strong>Fecha</strong></td><td>${date}</td></tr>` : ''}
            ${equipmentData.modelo ? `<tr><td><strong>Nombre comercial del equipo</strong></td><td>${equipmentData.modelo}</td></tr>` : ''}
            ${equipmentData.fabricante ? `<tr><td><strong>Fabricante</strong></td><td>${equipmentData.fabricante}</td></tr>` : ''}
            <tr>
                <td><strong>Importador o representante en Chile</strong></td>
                <td>Canon Chile S.A.</td>
            </tr>
            <tr>
                <td><strong>Domicilio</strong></td>
                <td>Alonso de Córdova 5670, Las Condes</td>
            </tr>
            <tr>
                <td><strong>Correo electrónico de contacto</strong></td>
                <td>contacto@canon.cl</td>
            </tr>
            <tr>
                <td><strong>Sitio web</strong></td>
                <td>www.canon.cl</td>
            </tr>
        </tbody>
    </table>
    <p>
        <br>
        &nbsp;
    </p>
    
    <h3 class="text-align-center">
        B. Características técnicas del equipo
    </h3>
    <table class="table">
        <tbody>
            ${equipmentData.tipo ? `<tr><td><strong>Tipo de equipo</strong></td><td>${equipmentData.tipo}</td></tr>` : ''}
            ${equipmentData.marca ? `<tr><td><strong>Marca</strong></td><td>${equipmentData.marca}</td></tr>` : ''}
            ${equipmentData.modelo ? `<tr><td><strong>Modelo</strong></td><td>${equipmentData.modelo}</td></tr>` : ''}
        </tbody>
    </table>
    <p>
        <br>
        &nbsp;
    </p>
    
    ${equipmentData.frecuencias || equipmentData.potencia ? `
    <h4>
        Módulo Wireless = <strong>${equipmentData.modelo || productName}</strong>
    </h4>
    <table class="table">
        <tbody>
            ${equipmentData.frecuencias ? `<tr><td><strong>Frecuencias</strong></td><td>${equipmentData.frecuencias}</td><td></td></tr>` : ''}
            ${equipmentData.potencia ? `<tr><td><strong>P.i.r.e.</strong></td><td>${equipmentData.potencia}</td><td></td></tr>` : ''}
        </tbody>
    </table>
    <p>
        <br>
        &nbsp;
    </p>
    ` : ''}
    
    <h3 class="text-align-center">
        C. Declaración de conformidad
    </h3>
    <table class="table">
        <tbody>
            <tr>
                <td>C. Declaración de conformidad: el equipo previamente individualizado cumple con las disposiciones establecidas en la Norma Técnica de Equipos de alcance reducido, aprobada por la resolución exenta N° 1.985, de 2017, de la Subsecretaría de Telecomunicaciones.</td>
                <td>Cumple</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
};

/**
 * Descargar HTML generado
 * @param {number} comunicadoId - ID del comunicado
 * @returns {Promise<string>} URL de descarga
 */
export const getHTMLDownloadUrl = async (comunicadoId) => {
    try {
        const { data: comunicado, error } = await supabase
            .from(TABLE_NAME)
            .select('html_path, name')
            .eq('id', comunicadoId)
            .single();

        if (error) throw error;
        if (!comunicado.html_path) throw new Error('HTML no generado aún');

        // Obtener URL pública
        const { data } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(comunicado.html_path);

        return data.publicUrl;
    } catch (error) {
        console.error('Error getting download URL:', error);
        throw error;
    }
};

/**
 * Eliminar comunicado
 * @param {number} comunicadoId - ID del comunicado
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteComunicado = async (comunicadoId) => {
    try {
        // 1. Obtener paths de archivos
        const { data: comunicado, error: fetchError } = await supabase
            .from(TABLE_NAME)
            .select('excel_path, html_path')
            .eq('id', comunicadoId)
            .single();

        if (fetchError) throw fetchError;

        // 2. Eliminar archivos de Storage
        const filesToDelete = [comunicado.excel_path, comunicado.html_path].filter(Boolean);
        
        if (filesToDelete.length > 0) {
            const { error: deleteStorageError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .remove(filesToDelete);

            if (deleteStorageError) {
                console.warn('Error eliminando archivos de storage:', deleteStorageError);
            }
        }

        // 3. Eliminar registro de la tabla
        const { error: deleteError } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', comunicadoId);

        if (deleteError) throw deleteError;

        return { success: true };
    } catch (error) {
        console.error('Error deleting comunicado:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Obtener estadísticas
 * @returns {Promise<Object>} Estadísticas
 */
export const getStats = async () => {
    try {
        const { count, error } = await supabase
            .from(TABLE_NAME)
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return { totalComunicados: count || 0 };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { totalComunicados: 0 };
    }
};
