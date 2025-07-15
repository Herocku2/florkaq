/**
 * Script de inicialización para FlorkaFun
 * Este script configura los modelos de datos y roles iniciales en Strapi
 */

module.exports = async () => {
  try {
    // Solo ejecutar en desarrollo o cuando se especifique
    if (process.env.NODE_ENV !== 'development' && !process.env.INIT_SCRIPT) {
      return;
    }

    console.log('🚀 Iniciando script de configuración para FlorkaFun...');

    // Verificar si ya se ha ejecutado antes
    const existingRoles = await strapi.query('plugin::users-permissions.role').findMany();
    if (existingRoles.length > 3) { // Strapi ya tiene 2 roles por defecto (authenticated, public)
      console.log('✅ La configuración ya ha sido ejecutada anteriormente.');
      return;
    }

    // Crear roles personalizados
    console.log('👥 Creando roles personalizados...');
    
    // Obtener los roles existentes
    const authenticatedRole = existingRoles.find(role => role.type === 'authenticated');
    const publicRole = existingRoles.find(role => role.type === 'public');
    
    // Crear rol de moderador
    const moderatorRole = await strapi.query('plugin::users-permissions.role').create({
      data: {
        name: 'Moderador',
        description: 'Rol para moderadores de foros y contenido',
        type: 'moderator',
        permissions: {}
      }
    });

    // Crear rol de administrador personalizado
    const adminRole = await strapi.query('plugin::users-permissions.role').create({
      data: {
        name: 'Admin',
        description: 'Rol para administradores de la plataforma',
        type: 'admin',
        permissions: {}
      }
    });

    console.log('✅ Roles creados correctamente');
    console.log('🔧 Configuración inicial completada');

  } catch (error) {
    console.error('❌ Error durante la configuración inicial:', error);
  }
};