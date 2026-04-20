# 🚀 Guía de Deployment a Netlify - Javo Apps

## ✅ Estado de las Apps para Deployment

### Apps que funcionarán SIN problemas en Netlify:

1. **✅ InPage Maker** 
   - Usa Supabase para datos
   - Assets en carpeta `public/`
   - **100% listo para deploy**

2. **✅ Marcajes Maker**
   - Usa Supabase para almacenar productos
   - No depende de archivos externos
   - **100% listo para deploy**

3. **✅ Comunicados App**
   - Usa Supabase para PDFs, Excel y HTMLs
   - Storage en Supabase bucket
   - **100% listo para deploy**

4. **✅ Mailings Dashboard**
   - Usa Supabase para datos de campañas
   - No depende de archivos externos
   - **100% listo para deploy**

5. **✅ Emailing Planner**
   - Código integrado en `src/pages/emailing-planner-src/`
   - Usa Supabase para datos
   - **100% listo para deploy**

6. **✅ Digital Brochure**
   - Código y datos copiados a `src/pages/digital-brochure-app/`
   - Assets en `public/digital-brochure/`
   - products.json integrado
   - **100% listo para deploy**

## 📦 Configuración de Supabase

Todas las apps usan Supabase como backend. Necesitas configurar las variables de entorno:

### Variables de entorno requeridas (Netlify):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_SUPABASE_SERVICE_KEY=tu-service-key-aqui
```

**Dónde obtener las keys:**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Settings → API
3. Copia URL, anon key y service_role key

## 🛠️ Pasos para Deploy en Netlify

### 1. Preparar el repositorio

```bash
cd "/Users/javohv/Desktop/Canon Apps/Javo Apps"

# Inicializar git (si no está inicializado)
git init
git add .
git commit -m "Initial commit - Javo Apps with all tools"

# Subir a GitHub
git remote add origin https://github.com/tu-usuario/javo-apps.git
git branch -M main
git push -u origin main
```

### 2. Configurar en Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Configuración del build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 o superior

### 3. Variables de entorno en Netlify

1. En tu sitio de Netlify → Site settings → Environment variables
2. Agrega las 3 variables de Supabase (ver arriba)
3. Save

### 4. Deploy

Click "Deploy site" y espera a que termine el build (~2-3 min)

## 📊 Checklist Pre-Deploy

- [ ] Todas las variables de Supabase están configuradas
- [ ] Los buckets de Supabase están creados:
  - [ ] `inpages` (para InPage Maker)
  - [ ] `comunicados` (para Comunicados App)
  - [ ] `mailings` (para Mailings Dashboard)
- [ ] Las tablas de Supabase existen:
  - [ ] `products` (Marcajes)
  - [ ] `comunicados`
  - [ ] `emailing_campaigns`
  - [ ] Otras según tus needs
- [ ] El repositorio está en GitHub
- [ ] `package.json` tiene el script `build`

## 🔧 Build Command Actual

El proyecto ya tiene configurado Vite, así que el build es:

```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos estáticos.

## 🌐 Post-Deploy

Una vez desplegado, tu app estará en:
```
https://tu-sitio.netlify.app
```

Todas las rutas funcionarán:
- `/` - Landing Page
- `/inpage-maker` - InPage Maker
- `/marcajes-maker` - Marcajes
- `/comunicados-app` - Comunicados
- `/mailings-dashboard` - Mailings
- `/emailing-planner` - Emailing Planner
- `/digital-brochure` - Digital Brochure

## ⚠️ Consideraciones Importantes

### 1. SPA Routing
Netlify necesita un archivo `_redirects` para que las rutas de React Router funcionen.

**Crear archivo:** `public/_redirects`
```
/*    /index.html   200
```

### 2. Assets públicos
Todos los assets en `public/` estarán disponibles en la raíz del sitio:
- `/assets/logo-atlas.gif`
- `/digital-brochure/...`
- etc.

### 3. CORS
Si tienes problemas de CORS con Supabase, verifica:
- Las políticas RLS (Row Level Security) en Supabase
- Los permisos de los buckets de storage

## 🎯 Próximos Pasos Opcionales

### Custom Domain
1. En Netlify → Domain settings
2. Add custom domain
3. Configurar DNS según instrucciones

### CI/CD Automático
Netlify ya tiene CI/CD automático:
- Cada push a `main` → deploy automático
- Preview deploys en pull requests

### Analytics
Activar Netlify Analytics para ver tráfico

## ❌ Lo que NO necesitas

- ❌ No necesitas el proyecto `CanonDigitalBrochure` separado (ya está integrado)
- ❌ No necesitas `Emailing App` separado (ya está integrado)
- ❌ No necesitas ningún servidor Node.js (todo es estático + Supabase)
- ❌ No necesitas Docker ni VPS

## 📝 Resumen

**TODO funciona completamente en Netlify** porque:

1. ✅ Todos los datos están en Supabase (cloud)
2. ✅ Todo el código está auto-contenido en Javo Apps
3. ✅ Es una SPA (Single Page Application) estática
4. ✅ Vite genera build optimizado
5. ✅ No hay dependencias a archivos locales

**Una vez subas el proyecto a GitHub y lo conectes con Netlify, TODAS las apps funcionarán perfectamente sin ningún cambio adicional.**

---

**Última actualización:** 31 de enero de 2026  
**Por:** javohv
