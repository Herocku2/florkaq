/**
 * Bootstrap function que se ejecuta al iniciar Strapi
 * Aquí configuramos los datos iniciales y roles
 */

const setupScript = require('../../init-scripts/setup');

module.exports = async () => {
  console.log('🚀 Ejecutando bootstrap de FlorkaFun...');
  
  // Ejecutar script de configuración inicial
  await setupScript();
  
  console.log('✅ Bootstrap completado');
};