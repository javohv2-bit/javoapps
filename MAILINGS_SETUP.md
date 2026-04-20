# Mailings Dashboard - Setup en Supabase

## 📋 Descripción

Dashboard de métricas de email marketing que procesa:
- **Excel histórico** (2021-2024): Datos anuales y mensuales de campañas
- **CSV mensuales** (2025): Detalle de campañas individuales
- **Visualización**: Métricas, tasas de conversión, revenue

## 🗄️ Estructura de Base de Datos

### Tablas Creadas

1. **`campaigns`**: Campañas individuales con métricas
   - year, month, campaign_name, subject
   - sends, successful_deliveries, bounces
   - opened, total_opens, open_rate
   - people_clicked, total_clicks, click_rate_*
   - users, transactions, revenue

2. **`monthly_summaries`**: Resúmenes mensuales agregados
   - year, month
   - Totales de todas las métricas
   - Tasas calculadas (open_rate, click_rate_*)

3. **`yearly_summaries`**: Totales anuales
   - year
   - Totales anuales de todas las métricas
   - Tasas promedio

4. **`mailings_files`**: Track de archivos subidos
   - file_name, file_type (excel/csv), file_path
   - year, month
   - status (uploaded/processed/error)

## 📁 Storage Bucket

**Nombre**: `mailings-files`

### Configuración:
- ✅ **Público**: Sí (para permitir descargas)
- 📏 **Tamaño máximo**: 50 MB
- 📝 **MIME types permitidos**: 
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel)
  - `text/csv` (CSV)
  - `application/pdf` (PDF)

### Estructura de carpetas:
```
mailings-files/
├── excel/
│   └── [timestamp]_[nombre].xlsx
├── csv/
│   ├── 2025/
│   │   ├── January_[timestamp].csv
│   │   ├── February_[timestamp].csv
│   │   └── ...
│   └── 2024/
└── pdf/
    └── [timestamp]_[nombre].pdf
```

## ⚙️ Instalación

### 1. Crear Tablas en Supabase

Ve a **SQL Editor** en Supabase Dashboard y ejecuta:

```bash
scripts/mailings-dashboard-table.sql
```

O copia el contenido del archivo y pégalo en el SQL Editor.

### 2. Crear Bucket de Storage

1. Ve a **Storage** en Supabase Dashboard
2. Click en **New Bucket**
3. Configuración:
   - **Name**: `mailings-files`
   - **Public bucket**: ✅ **ACTIVAR** (importante)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Agregar los tipos mencionados arriba

4. Click en **Create bucket**

### 3. Configurar Políticas de Storage

El bucket debe tener estas políticas (se crean automáticamente al ser público):

```sql
-- Lectura pública
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'mailings-files');

-- Upload autenticado
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'mailings-files');

-- Delete autenticado
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'mailings-files');
```

## ✅ Verificación

Ejecuta el script de verificación:

```bash
node scripts/verify-mailings.js
```

Deberías ver:
- ✅ Tabla "campaigns" existe
- ✅ Tabla "monthly_summaries" existe
- ✅ Tabla "yearly_summaries" existe
- ✅ Tabla "mailings_files" existe
- ✅ Bucket "mailings-files" existe - Público: Sí ✓
- ✅ Inserción exitosa
- ✅ Registro de prueba eliminado
- 🎉 ¡TODO LISTO!

## 📊 Flujo de Uso

### 1. Upload Excel Histórico (2021-2024)

1. Click en **Upload** en la sección "Excel Histórico"
2. Selecciona archivo `.xlsx` con hojas "Annual Summary [año]"
3. El sistema procesa automáticamente:
   - Extrae datos mensuales (filas 2-13)
   - Calcula tasas (open_rate, click_rate_*)
   - Guarda en `monthly_summaries`
   - Agrega totales anuales en `yearly_summaries`

### 2. Upload CSV Campaña Mensual (2025)

1. Selecciona **Mes** en el dropdown
2. Click en **Upload CSV**
3. Selecciona archivo `.csv` con columnas:
   - Campaign, Subject, Date
   - Sends, Deliveries, Opens, Clicks
   - Revenue, Users, Transactions

4. El sistema procesa:
   - Crea registros en `campaigns`
   - Recalcula `monthly_summaries` del mes
   - Actualiza `yearly_summaries` del año

### 3. Visualización

- **Selector de Año**: Filtra datos por año (2021-2025)
- **Cards de Métricas**: Totales anuales (Entregas, Open Rate, Click Rate, Revenue)
- **Resumen Mensual**: Grid de 12 meses con datos disponibles
- **Tabla de Campañas**: Detalle de cada campaña del mes seleccionado

## 🔄 Cálculos Automáticos

El sistema calcula automáticamente:

```javascript
open_rate = opened / successful_deliveries
click_rate_opened = people_clicked / opened
click_rate_delivered = people_clicked / successful_deliveries
```

Los totales mensuales y anuales se recalculan al:
- Subir nuevo Excel
- Subir nuevo CSV
- Eliminar archivos

## 🎨 Diseño

- **Background**: Aurora gradient animado (5 blobs con colores cyan, purple, teal, amber, blue)
- **Header**: Fondo blanco con logo Atlas Digital
- **Cards**: Gradientes de colores según métrica (blue, emerald, purple, amber)
- **Tipografía**: Inter font, text-xs, text-base, font-medium
- **Animaciones**: Framer Motion para transiciones suaves

## 🚨 Troubleshooting

### Error: "Tabla no existe"
→ Ejecuta `scripts/mailings-dashboard-table.sql` en SQL Editor

### Error: "Bucket not found"
→ Verifica que el bucket se llame exactamente `mailings-files`
→ Verifica que sea público

### Excel no se procesa
→ Verifica que las hojas se llamen "Annual Summary [año]"
→ Verifica que los datos estén en las filas correctas (2-13)
→ Revisa la consola del navegador para errores

### CSV no se procesa
→ Verifica que tenga las columnas esperadas
→ Verifica que el formato de fecha sea válido
→ Revisa la consola del navegador

### No se muestran datos
→ Verifica que hayan archivos procesados
→ Verifica que el año seleccionado tenga datos
→ Ejecuta `node scripts/verify-mailings.js` para verificar configuración

## 📝 Notas Técnicas

### Formato de Excel Esperado

**Hoja: "Annual Summary [año]"**

| Row | Col A | Col B | Col C | Col D | Col E | Col F | ... | Col M |
|-----|-------|-------|-------|-------|-------|-------|-----|-------|
| 2   | Jan   | Deliv | Opens | -     | TotalOpens | Clicked | ... | Revenue |
| 3   | Feb   | ...   | ...   | ...   | ...   | ...   | ... | ...   |
| ... | ...   | ...   | ...   | ...   | ...   | ...   | ... | ...   |
| 13  | Dec   | ...   | ...   | ...   | ...   | ...   | ... | ...   |

### Formato de CSV Esperado

```csv
Campaign,Subject,Date,Sends,Deliveries,Opens,Clicks,Revenue,Users,Transactions
"Campaign Name","Subject Line",2025-01-15,5000,4950,1200,300,500000,50,25
```

### Columnas alternativas (español):
- Campaña, Asunto, Fecha
- Envíos, Entregas, Aperturas, Clics
- Ingresos, Usuarios, Transacciones

## 🔗 Referencias

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [XLSX.js Documentation](https://docs.sheetjs.com/)

---

**Última actualización**: Enero 30, 2026
**Versión**: 1.0.0
