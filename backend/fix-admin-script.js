const path = require('path');

// Configurar Strapi
const strapi = require('@strapi/strapi')({
  distDir: path.join(__dirname, 'dist'),
});

const fixAdmin = require('./init-scripts/fix-admin');

async function runFix() {
  try {
    console.log('🚀 Iniciando Strapi...');
    await strapi.load();
    
    console.log('🔧 Ejecutando fix de administrador...');
    await fixAdmin();
    
    console.log('✅ Fix completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runFix();