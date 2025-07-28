const path = require('path');

// Configurar Strapi
const strapi = require('@strapi/strapi')({
  distDir: path.join(__dirname, 'dist'),
});

const setupPublicPermissions = require('./init-scripts/setup-public-permissions');

async function runSetup() {
  try {
    console.log('🚀 Iniciando Strapi...');
    await strapi.load();
    
    console.log('🔓 Configurando permisos públicos...');
    await setupPublicPermissions();
    
    console.log('✅ Configuración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runSetup();