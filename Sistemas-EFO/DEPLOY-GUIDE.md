# 🚀 Guía de Despliegue: Vercel + Supabase

Esta guía te ayudará a desplegar la aplicación Sistema EFO en Vercel con base de datos Supabase.

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Supabase](https://supabase.com)
- Git repository (GitHub, GitLab, o Bitbucket)

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Elige una región cercana (por ejemplo: South America - São Paulo)
4. Establece una contraseña segura para la base de datos

### 1.2 Configurar Base de Datos
1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia y pega todo el contenido del archivo `database/schema.sql`
3. Ejecuta el script para crear todas las tablas y datos iniciales

### 1.3 Obtener Credenciales
1. Ve a **Settings > API**
2. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://xyzcompany.supabase.co`)
   - **anon public** key (clave pública anónima)

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Conectar Repositorio
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Conecta tu cuenta de GitHub/GitLab/Bitbucket
3. Importa el repositorio del proyecto

### 2.2 Configurar Variables de Entorno
En la configuración del proyecto en Vercel:

1. Ve a **Settings > Environment Variables**
2. Agrega las siguientes variables:

```
VITE_SUPABASE_URL=tu_project_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 2.3 Configuración de Build
Vercel debería detectar automáticamente que es un proyecto Vite, pero si necesitas configuración manual:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.4 Desplegar
1. Haz clic en **Deploy**
2. Espera a que termine el proceso de build y despliegue
3. ¡Tu aplicación estará disponible en una URL de Vercel!

## 🔐 Paso 3: Configurar Autenticación (Opcional)

Si quieres habilitar autenticación con Supabase:

### 3.1 En Supabase
1. Ve a **Authentication > Settings**
2. Configura las URLs de tu sitio:
   - **Site URL**: `https://tu-app.vercel.app`
   - **Redirect URLs**: `https://tu-app.vercel.app/auth/callback`

### 3.2 Habilitar Proveedores
1. En **Authentication > Providers**
2. Habilita los proveedores que necesites (Google, GitHub, etc.)

## 📊 Paso 4: Verificar Funcionamiento

### 4.1 Probar Conexión a Base de Datos
1. Ve a tu aplicación desplegada
2. Intenta crear un formulario o cotización
3. Verifica en Supabase que los datos se guardan correctamente

### 4.2 Probar Funcionalidades
- **✅ Cotizador de Patch Cords**: Crear y generar PDF
- **✅ Formularios de Crédito**: Envío y almacenamiento
- **✅ Panel de Administración**: Login y gestión
- **✅ Selector OTDR**: Búsqueda y filtrado

## 🔄 Paso 5: Actualizaciones Automáticas

### Git Deploy
Vercel automáticamente redespliega cuando:
- Haces push a la rama principal (main/master)
- Creas un pull request (deploy preview)

### Variables de Entorno
Después de cambiar variables de entorno en Vercel:
1. Ve a **Deployments**
2. Redeploy la última versión

## 🛠️ Comandos Útiles

### Desarrollo Local con Supabase
```bash
# Crear archivo .env local
cp .env.example .env

# Editar .env con tus credenciales de Supabase
# VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
# VITE_SUPABASE_ANON_KEY=tu-anon-key

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Build Local
```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📝 Estructura de URLs

Una vez desplegado, tendrás:
- **Aplicación Principal**: `https://tu-app.vercel.app`
- **Panel Admin**: `https://tu-app.vercel.app/admin`
- **Cotizador**: `https://tu-app.vercel.app/cotizador-patchcords`
- **Selector OTDR**: `https://tu-app.vercel.app/selector-otdr`

## 🐛 Troubleshooting

### Error de Variables de Entorno
- Verifica que las variables empiecen con `VITE_`
- Redeploy después de cambiar variables

### Error de CORS
- Configura las URLs correctas en Supabase
- Verifica la configuración de autenticación

### Error de Build
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`

## 🔒 Seguridad

### Variables de Entorno
- ✅ Nunca subas archivos `.env` al repositorio
- ✅ Usa variables de entorno de Vercel para producción
- ✅ Rota las claves periódicamente

### Supabase
- ✅ Configura Row Level Security (RLS) según necesites
- ✅ Usa la clave anónima solo para frontend
- ✅ Configura policies de acceso apropiadas

## 📈 Monitoreo

### Vercel Analytics
1. Habilita Analytics en tu proyecto Vercel
2. Monitorea performance y errores

### Supabase Monitoring
1. Revisa el dashboard de Supabase para uso de DB
2. Configura alertas si es necesario

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la consola del navegador
3. Consulta la documentación de [Vercel](https://vercel.com/docs) y [Supabase](https://supabase.com/docs)

¡Tu aplicación Sistema EFO estará lista para producción! 🎉
