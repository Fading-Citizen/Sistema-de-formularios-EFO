# 🚀 Guía para Subir a GitHub y Vercel

## 📋 Paso 1: Preparar el Repositorio en GitHub

### 1.1 Crear Repositorio en GitHub
1. Ve a [github.com](https://github.com) y haz login
2. Haz clic en el botón **"New"** (verde) o **"+"** → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `sistema-efo-production`
   - **Description**: `Sistema EFO - Formularios y Cotizador con Supabase`
   - **Visibility**: Private (recomendado para proyectos comerciales)
   - ✅ **Add a README file**
   - ✅ **Add .gitignore**: Node
4. Haz clic en **"Create repository"**

### 1.2 Obtener la URL del Repositorio
Después de crear el repo, copia la URL HTTPS:
```
https://github.com/TU-USUARIO/sistema-efo-production.git
```

## 🔧 Paso 2: Inicializar Git y Subir Código

### 2.1 Abrir Terminal en la Carpeta del Proyecto
```powershell
cd "c:\Users\desar\Documents\EFO develop\Sistema-de-formularios-EFO\Sistemas-EFO"
```

### 2.2 Inicializar Git (si no está inicializado)
```powershell
git init
```

### 2.3 Agregar Archivos
```powershell
git add .
```

### 2.4 Hacer Commit Inicial
```powershell
git commit -m "Initial commit: Sistema EFO completo con Supabase"
```

### 2.5 Agregar Origen Remoto
```powershell
git remote add origin https://github.com/TU-USUARIO/sistema-efo-production.git
```

### 2.6 Subir a GitHub
```powershell
git branch -M main
git push -u origin main
```

## 🌐 Paso 3: Desplegar en Vercel

### 3.1 Crear Cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tus repositorios

### 3.2 Importar Proyecto
1. En el dashboard de Vercel, haz clic en **"New Project"**
2. Busca tu repositorio: `sistema-efo-production`
3. Haz clic en **"Import"**

### 3.3 Configurar el Proyecto
En la pantalla de configuración:

**Project Name**: `sistema-efo-production`
**Framework Preset**: Vite (se detecta automáticamente)
**Root Directory**: `.` (por defecto)
**Build Command**: `npm run build` (por defecto)
**Output Directory**: `dist` (por defecto)
**Install Command**: `npm install` (por defecto)

### 3.4 Configurar Variables de Entorno
Antes de hacer deploy, agrega las variables de entorno:

1. En la sección **"Environment Variables"**
2. Agrega las siguientes variables:

```
VITE_SUPABASE_URL=https://edunmdzcthgtszmpyxmh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdW5tZHpjdGhndHN6bXB5eG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTExMDQsImV4cCI6MjA3MjA2NzEwNH0.TcLzSyf52uRLdTZXhGAcWYDGyxm_skm2ya6w1eqR35s
```

### 3.5 Hacer Deploy
1. Haz clic en **"Deploy"**
2. Espera a que termine el proceso (2-5 minutos)
3. ¡Tu aplicación estará online!

## ✅ URLs Resultantes

Una vez desplegado tendrás:

### 🏠 **Aplicación Principal**
```
https://sistema-efo-production.vercel.app
```

### 📋 **Páginas Específicas**
```
https://sistema-efo-production.vercel.app/form/credito-efo
https://sistema-efo-production.vercel.app/admin/dashboard
https://sistema-efo-production.vercel.app/patch-cords
https://sistema-efo-production.vercel.app/selector/otdr
https://sistema-efo-production.vercel.app/test/conexion
```

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

```powershell
# 1. Hacer cambios en el código
# 2. Agregar cambios a Git
git add .

# 3. Hacer commit con descripción
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push

# 5. Vercel redesplegará automáticamente
```

## 🛠️ Comandos de Terminal para Copy-Paste

### Si ya tienes Git inicializado:
```powershell
cd "c:\Users\desar\Documents\EFO develop\Sistema-de-formularios-EFO\Sistemas-EFO"
git add .
git commit -m "Initial commit: Sistema EFO completo con Supabase"
git remote add origin https://github.com/TU-USUARIO/sistema-efo-production.git
git branch -M main
git push -u origin main
```

### Si necesitas inicializar Git:
```powershell
cd "c:\Users\desar\Documents\EFO develop\Sistema-de-formularios-EFO\Sistemas-EFO"
git init
git add .
git commit -m "Initial commit: Sistema EFO completo con Supabase"
git remote add origin https://github.com/TU-USUARIO/sistema-efo-production.git
git branch -M main
git push -u origin main
```

## 🎉 ¡Listo!

Tu Sistema EFO estará disponible globalmente con:
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy automático con Git
- ✅ Base de datos Supabase
- ✅ Escalabilidad automática

**¿Algún paso no funciona? ¡Avísame y te ayudo a resolverlo!**
