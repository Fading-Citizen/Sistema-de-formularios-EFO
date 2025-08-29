# ⚡ Configuración Rápida de Supabase

## 🎯 Pasos Inmediatos (3 minutos)

### 1. Configurar Base de Datos
1. Ve a tu proyecto Supabase: https://app.supabase.com/project/edunmdzcthgtszmpyxmh
2. Ve a **SQL Editor** (en el menú lateral)
3. Copia y pega todo el contenido de `database/supabase-quick-setup.sql`
4. Haz clic en **RUN** para ejecutar el script

### 2. Verificar Configuración
Las variables de entorno ya están configuradas en tu archivo `.env`:
```
VITE_SUPABASE_URL=https://edunmdzcthgtszmpyxmh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Probar Conexión
1. Ejecuta el servidor: `npm run dev`
2. Ve a: http://localhost:5174/test/supabase
3. Verifica que todas las pruebas pasen ✅

## 📊 Lo que se creará en Supabase:

### Tablas:
- ✅ **users** - Usuarios del sistema
- ✅ **formularios** - Formularios de crédito
- ✅ **productos** - Patch cords y productos
- ✅ **cotizaciones** - Cotizaciones generadas
- ✅ **equipos_otdr** - Equipos OTDR disponibles

### Datos de Ejemplo:
- ✅ **8 productos** de patch cords con precios
- ✅ **6 equipos OTDR** con especificaciones
- ✅ **1 usuario admin** (admin@efo.com)

## 🧪 Página de Pruebas

La aplicación incluye una página de pruebas en:
**http://localhost:5174/test/supabase**

Esta página:
- ✅ Verifica la conexión a Supabase
- ✅ Lee productos de la base de datos
- ✅ Crea una cotización de prueba
- ✅ Lista cotizaciones recientes
- ✅ Muestra el estado de todas las operaciones

## 🚀 Una vez verificado:

1. **Deploy en Vercel**: Sigue `DEPLOY-GUIDE.md`
2. **Configurar variables en Vercel**: Mismas que tienes en `.env`
3. **¡Listo!**: Tu app estará online con base de datos real

## 🔐 Credenciales de Prueba:

- **Email**: admin@efo.com
- **Password**: admin123 (cambiar después del primer login)

---

**⏱️ Tiempo total: 3 minutos para tener Supabase funcionando**
