# Recursos Multimedia EFO

Esta carpeta contiene todos los recursos multimedia para la aplicación de Formularios EFO.

## Estructura de carpetas

- `images/` - Logos, iconos e imágenes corporativas
  - Coloca aquí los logos de EFO en diferentes formatos (PNG, SVG, JPG)
  - Formatos recomendados:
    - `logo-efo-principal.svg` - Logo principal en SVG
    - `logo-efo-horizontal.png` - Logo horizontal
    - `logo-efo-vertical.png` - Logo vertical
    - `favicon.ico` - Favicon para el sitio

## Colores Corporativos EFO

- **Primario**: #006068
- **Secundario**: #54595F  
- **Acento**: #87F7EE

## Uso en la aplicación

Los recursos se importan usando rutas relativas desde `src/assets/`

Ejemplo:
```jsx
import logoEFO from '../assets/images/logo-efo-principal.svg';
```
