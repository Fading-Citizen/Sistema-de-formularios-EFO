// Script temporal para actualizar colores
const fs = require('fs');
const path = require('path');

// Mapa de colores a reemplazar
const colorMap = {
  // Colores antiguos -> Colores nuevos de EFO
  '#2d3748': 'var(--efo-primary)',
  '#718096': 'var(--efo-secondary)',
  '#f6ad55': 'var(--efo-emphasis)',
  '#ed8936': 'var(--efo-accent)',
  '#4299e1': 'var(--efo-primary)',
  '#3182ce': 'var(--efo-primary-dark)',
  '#48bb78': 'var(--efo-accent)',
  '#38a169': 'var(--efo-primary)',
  '#e53e3e': '#dc3545', // Mantener rojo para errores
  '#c53030': '#c82333', // Mantener rojo para errores
  '#a0aec0': 'var(--efo-secondary)',
  '#666': 'var(--efo-secondary)',
  '#495057': 'var(--efo-secondary)',
  '#006068': 'var(--efo-primary)',
  '#1a3a28': 'var(--efo-primary-dark)',
  '#0f2419': 'var(--efo-primary-dark)',
  '#856404': 'var(--efo-primary)',
  '#004d54': 'var(--efo-primary-dark)',
  '#004a52': 'var(--efo-primary-dark)',
  
  // Fondos y bordes
  '#f5f7fa': 'var(--efo-background)',
  '#c3cfe2': 'var(--efo-accent)',
  '#e9ecef': 'rgba(135, 247, 238, 0.3)',
  '#f8f9fa': 'var(--efo-background)',
  '#fafbfc': 'var(--efo-background)',
  '#dee2e6': 'var(--efo-accent)',
  
  // Validaciones
  '#28a745': 'var(--efo-primary)',
  '#f8fff9': 'var(--efo-background)',
  '#fff8f8': '#fff8f8', // Mantener para errores
  
  // Alertas
  '#fff3cd': 'rgba(248, 250, 0, 0.1)',
  '#ffeaa7': 'rgba(248, 250, 0, 0.3)',
};

// Función para actualizar colores en un archivo
function updateColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(oldColor.replace('#', '\\#'), 'g');
      if (content.includes(oldColor)) {
        content = content.replace(regex, newColor);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Actualizado: ${filePath}`);
    } else {
      console.log(`⏭️  Sin cambios: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}:`, error.message);
  }
}

// Buscar todos los archivos CSS
const srcDir = './src';

function findCSSFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item.endsWith('.css')) {
        files.push(fullPath);
      }
    });
  }
  
  scan(dir);
  return files;
}

// Ejecutar actualización
console.log('🎨 Actualizando colores a esquema oficial EFO...\n');

const cssFiles = findCSSFiles(srcDir);
cssFiles.forEach(updateColorsInFile);

console.log('\n✨ Actualización de colores completada!');
