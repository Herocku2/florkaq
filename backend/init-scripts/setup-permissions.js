const setupPermissions = async () => {
  try {
    console.log('🔧 Configurando permisos de users-permissions...');

    // Obtener el rol 'Public'
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ No se encontró el rol Public');
      return;
    }

    console.log('✅ Rol Public encontrado:', publicRole.id);

    // Configurar permisos para el rol Public
    const permissions = [
      // Auth permissions
      {
        action: 'plugin::users-permissions.auth.register',
        enabled: true,
      },
      {
        action: 'plugin::users-permissions.auth.callback',
        enabled: true,
      },
      {
        action: 'plugin::users-permissions.auth.connect',
        enabled: true,
      },
      {
        action: 'plugin::users-permissions.auth.forgotPassword',
        enabled: true,
      },
      {
        action: 'plugin::users-permissions.auth.resetPassword',
        enabled: true,
      },
      {
        action: 'plugin::users-permissions.auth.emailConfirmation',
        enabled: true,
      },
      // User permissions
      {
        action: 'plugin::users-permissions.user.me',
        enabled: true,
      },
    ];

    // Aplicar permisos
    for (const permission of permissions) {
      try {
        // Buscar si el permiso ya existe
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission.action,
            role: publicRole.id,
          }
        });

        if (existingPermission) {
          // Actualizar permiso existente
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: permission.enabled }
          });
          console.log(`✅ Permiso actualizado: ${permission.action}`);
        } else {
          // Crear nuevo permiso
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: permission.action,
              enabled: permission.enabled,
              policy: '',
              role: publicRole.id,
            }
          });
          console.log(`✅ Permiso creado: ${permission.action}`);
        }
      } catch (error) {
        console.error(`❌ Error configurando permiso ${permission.action}:`, error.message);
      }
    }

    // Configurar permisos para APIs personalizadas
    const customPermissions = [
      // Token API
      {
        action: 'api::token.token.find',
        enabled: true,
      },
      {
        action: 'api::token.token.findOne',
        enabled: true,
      },
      // Voto API
      {
        action: 'api::voto.voto.find',
        enabled: true,
      },
      {
        action: 'api::voto.voto.create',
        enabled: true,
      },
      {
        action: 'api::voto.voto.delete',
        enabled: true,
      },
    ];

    for (const permission of customPermissions) {
      try {
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission.action,
            role: publicRole.id,
          }
        });

        if (existingPermission) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: permission.enabled }
          });
          console.log(`✅ Permiso API actualizado: ${permission.action}`);
        } else {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: permission.action,
              enabled: permission.enabled,
              policy: '',
              role: publicRole.id,
            }
          });
          console.log(`✅ Permiso API creado: ${permission.action}`);
        }
      } catch (error) {
        console.error(`❌ Error configurando permiso API ${permission.action}:`, error.message);
      }
    }

    console.log('🎉 Configuración de permisos completada!');

  } catch (error) {
    console.error('❌ Error en configuración de permisos:', error);
  }
};

module.exports = setupPermissions;