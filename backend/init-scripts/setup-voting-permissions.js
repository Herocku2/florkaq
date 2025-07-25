const setupVotingPermissions = async () => {
  try {
    console.log('🔧 Configurando permisos para votaciones...');

    // Obtener el rol Public
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.log('❌ Rol Public no encontrado');
      return;
    }

    console.log('✅ Rol Public encontrado:', publicRole.id);

    // Configurar permisos para votaciones
    const votacionPermissions = [
      'api::votacion.votacion.find',
      'api::votacion.votacion.findOne'
    ];

    for (const permission of votacionPermissions) {
      try {
        const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: permission,
            role: publicRole.id
          }
        });

        if (existingPermission) {
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true }
          });
        } else {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: permission,
              enabled: true,
              policy: '',
              role: publicRole.id
            }
          });
        }
        
        console.log('✅ Permiso configurado:', permission);
      } catch (error) {
        console.error('❌ Error configurando permiso:', permission, error.message);
      }
    }

    console.log('🎉 Permisos de votaciones configurados!');

  } catch (error) {
    console.error('❌ Error configurando permisos de votaciones:', error);
  }
};

module.exports = setupVotingPermissions;