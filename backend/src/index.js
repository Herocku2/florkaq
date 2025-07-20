'use strict';

const setupPermissions = require('../init-scripts/setup-permissions');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Iniciando FlorkaFun Backend...');
    
    // Configurar permisos automáticamente
    setTimeout(async () => {
      await setupPermissions();
    }, 3000); // Esperar 3 segundos para que Strapi termine de inicializar
    
    console.log('✅ FlorkaFun Backend iniciado correctamente!');
  },
};