# TODO - Mejoras exportación PPT (Gráficas Mensuales)

## Plan
- [x] Auditar diferencias entre preview y export (layout, escala, filtros, logos, fondos).
- [x] Unificar cálculo geométrico para `contain` y posicionamiento exacto en export.
- [x] Corregir portada para que logo Canon salga blanco también en `.pptx`.
- [x] Alinear render de preview con propiedades visuales usadas en export (filtros/estilos).
- [x] Agregar mejoras de robustez del flujo (validación de archivos, manejo de errores/casos límite).
- [x] Ejecutar verificación (`npm run build`) y documentar resultados.

## Review
- `npm run build`: OK, compilación completada y bundle generado.
- `npm run lint`: no ejecutable por dependencia faltante (`eslint: command not found`).
- Se incorporó renderizado de primera página PDF a imagen para mantener consistencia visual en preview/export.
- Corrección adicional: videos ahora se incrustan como objeto multimedia real en PPT (`addMedia` con `path`/`data`) y ya no con overlay manual tipo emoji.
- Corrección adicional: logos de Canon/Atlas en láminas ahora mantienen proporción original (sin estiramiento).
- Corrección adicional: logos de esquina en export reducidos y con opacidad equivalente al preview.
- Ajuste aplicado: se removieron las zonas seguras intrusivas que desplazaban elementos y causaban solapamientos/desalineación.
- Criterio final: los logos quedan en capa superior (visibles) sin reacomodar automáticamente materiales.
- Corrección adicional: miniatura de video toma un frame temprano para evitar preview con dominante rosada de transición.
- Corrección adicional: portada de video para `addMedia` ahora se genera en PNG y con selección de frame anti-magenta.
