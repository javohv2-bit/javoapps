# Comunicados App - Setup en Supabase

## Configuración Inicial

La aplicación Comunicados App requiere una configuración en Supabase para funcionar correctamente en producción (Netlify).

### 1. Tabla de Base de Datos

✅ **Ya creada**: La tabla `comunicados` ya existe en Supabase.

Si necesitas recrearla o verificarla, ve a **SQL Editor** en Supabase y ejecuta:

```sql
-- Crear tabla de comunicados
CREATE TABLE IF NOT EXISTS comunicados (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    excel_path TEXT NOT NULL,
    excel_data JSONB,
    html_path TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_comunicados_status ON comunicados(status);
CREATE INDEX IF NOT EXISTS idx_comunicados_created ON comunicados(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Enable read access for all users" ON comunicados
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON comunicados
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON comunicados
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON comunicados
    FOR DELETE USING (true);
```

### 2. Bucket de Storage

⚠️ **PENDIENTE**: Crear bucket `comunicados-files`

#### Pasos para crear el bucket:

1. Ve a **Storage** en tu Dashboard de Supabase
2. Click en **New Bucket**
3. Configuración:
   - **Name**: `comunicados-files`
   - **Public bucket**: ✅ Activar (importante para descargas)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: 
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel)
     - `text/html` (HTML)

4. Click en **Create bucket**

### 3. Políticas de Storage

Después de crear el bucket, configura las políticas de acceso:

Ve a **Storage** → `comunicados-files` → **Policies** y crea:

#### Política de lectura pública:
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'comunicados-files');
```

#### Política de upload (autenticado):
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'comunicados-files');
```

#### Política de eliminación:
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'comunicados-files');
```

## Estructura de Archivos en Storage

```
comunicados-files/
├── excels/
│   └── [timestamp]_[nombre].xlsx
└── htmls/
    └── [nombre]_[timestamp].html
```

## Flujo de Funcionamiento

1. **Upload Excel**: 
   - Usuario sube archivo .xlsx
   - Se almacena en `comunicados-files/excels/`
   - Se procesa y extrae datos
   - Se guarda metadata en tabla `comunicados`

2. **Generar HTML**:
   - Se lee `excel_data` de la tabla
   - Se genera HTML con plantilla
   - Se sube HTML a `comunicados-files/htmls/`
   - Se actualiza registro con `html_path`

3. **Preview con Edición en Tiempo Real**:
   - Click en botón "Preview" para ver el HTML generado
   - **Panel izquierdo**: Código HTML con syntax highlighting
   - **Panel derecho**: Campos editables extraídos del Excel
   - Editar título, módulo/header, o cualquier campo (label, valor, página)
   - **El HTML se regenera automáticamente** mientras editas
   - Click en "✓ Guardar" para actualizar datos en Supabase y regenerar HTML en Storage
   - Los cambios persisten en la base de datos

4. **Descargar HTML**:
   - Se obtiene URL pública del archivo
   - Usuario descarga directamente desde Supabase Storage

## Verificación

Para verificar que todo está configurado:

```bash
npm run setup-comunicados
```

O manualmente:

```bash
node scripts/setup-comunicados-supabase.js
```

Deberías ver:
- ✅ Tabla "comunicados" existe
- ✅ Bucket "comunicados-files" existe
- ✅ Conexión exitosa

## Troubleshooting

### Error: "Bucket not found"
- Verifica que el bucket se llame exactamente `comunicados-files`
- Verifica que el bucket sea público

### Error: "Permission denied"
- Verifica las políticas de RLS en la tabla
- Verifica las políticas de Storage

### Excel no se sube
- Verifica que el MIME type esté permitido en el bucket
- Verifica el tamaño del archivo (máx 50MB)

### HTML no se genera
- Verifica que los datos del Excel se hayan procesado correctamente
- Revisa la consola del navegador para errores
