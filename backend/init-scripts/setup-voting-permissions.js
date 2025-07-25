const setupAllPermissions = async () => {
  try {
    console.log('🔧 Configurando permisos públicos para todas las APIs...');

    // Obtener el rol Public
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.log('❌ Rol Public no encontrado');
      return;
    }

    console.log('✅ Rol Public encontrado:', publicRole.id);

    // Configurar permisos para todas las APIs necesarias
    const allPermissions = [
      // Tokens
      'api::token.token.find',
      'api::token.token.findOne',
      // Rankings
      'api::ranking.ranking.find', 
      'api::ranking.ranking.findOne',
      // Votaciones
      'api::votacion.votacion.find',
      'api::votacion.votacion.findOne',
      // Candidatos
      'api::candidato.candidato.find',
      'api::candidato.candidato.findOne',
      // Noticias
      'api::noticia.noticia.find',
      'api::noticia.noticia.findOne'
    ];

    for (const permission of allPermissions) {
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

    console.log('🎉 Todos los permisos configurados!');

  } catch (error) {
    console.error('❌ Error configurando permisos:', error);
  }
};

module.exports = setupAllPermissions;