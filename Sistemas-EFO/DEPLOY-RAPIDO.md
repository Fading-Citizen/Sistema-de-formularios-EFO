# 🚀 Deploy Inmediato en Vercel

## ✅ Tu código ya está en GitHub!

Tu repositorio está listo en: https://github.com/Fading-Citizen/Sistema-de-formularios-EFO

## 🌐 Pasos para Vercel (5 minutos)

### 1. Ir a Vercel
👉 Ve a: https://vercel.com/new

### 2. Conectar GitHub
- Haz clic en **"Continue with GitHub"**
- Autoriza Vercel si es necesario

### 3. Importar tu Repositorio
- Busca: **"Sistema-de-formularios-EFO"**
- Haz clic en **"Import"**

### 4. Configurar Variables de Entorno ⚠️ IMPORTANTE
**Antes de hacer deploy**, en la pantalla de configuración de Vercel:

1. **Busca la sección**: "Environment Variables" (está abajo)
2. **Haz clic en**: "Add" o "+" para agregar variables
3. **Agrega estas DOS variables**:

**Primera variable:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://edunmdzcthgtszmpyxmh.supabase.co`
- Haz clic en "Add"

**Segunda variable:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdW5tZHpjdGhndHN6bXB5eG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTExMDQsImV4cCI6MjA3MjA2NzEwNH0.TcLzSyf52uRLdTZXhGAcWYDGyxm_skm2ya6w1eqR35s`
- Haz clic en "Add"

**📍 Ubicación**: La sección "Environment Variables" está en la misma pantalla donde importas el repositorio, justo debajo de la configuración del proyecto.

### 5. Deploy
- Haz clic en **"Deploy"**
- Espera 2-3 minutos
- ¡Tu app estará online!

## 🎯 URLs Resultantes

Tu app estará disponible en algo como:
```
https://sistema-de-formularios-efo-xxx.vercel.app
```

### Páginas específicas:
- `/form/credito-efo` - Formulario de crédito
- `/patch-cords` - Cotizador
- `/admin/dashboard` - Dashboard admin
- `/test/conexion` - Test de Supabase

## 🔄 Actualizaciones Futuras

Para actualizar tu app:
```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel redesplegará automáticamente en 1-2 minutos.

## 🛠️ Si algo no funciona

1. **Variables de entorno**: Verifica que estén correctas
2. **Build errors**: Revisa los logs en Vercel
3. **Supabase**: Verifica que la URL y key sean correctas

## 🎉 ¡Listo!

Tu Sistema EFO estará online en el mundo con:
- ✅ HTTPS automático
- ✅ CDN global (super rápido)
- ✅ Supabase conectado
- ✅ Deploy automático con Git

**¡Avísame cuando esté desplegado para hacer las pruebas finales!**
