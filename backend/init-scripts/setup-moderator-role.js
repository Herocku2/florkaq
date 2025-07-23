const setupModeratorRole = async () => {
  try {
    console.log('🛡️ Configurando rol de moderador en Strapi Admin...');

    // Verificar si ya existe el rol de moderador
    const existingRole = await strapi.query('admin::role').findOne({
      where: { code: 'moderator' }
    });

    if (existingRole) {
      console.log('✅ Rol de moderador ya existe');
      return existingRole;
    }

    // Crear el rol de moderador
    const moderatorRole = await strapi.query('admin::role').create({
      data: {
        name: 'Moderador de Foros',
        code: 'moderator',
        description: 'Rol para moderadores que solo pueden gestionar foros y comentarios'
      }
    });

    console.log('✅ Rol de moderador creado:', moderatorRole.name);

    // Configurar permisos específicos para el rol de moderador
    const permissions = [
      // Permisos para Content Manager - Solo Foros
      {
        action: 'plugin::content-manager.explorer.create',
        subject: 'api::foro.foro',
        conditions: [],
        properties: {
          fields: ['titulo', 'descripcion', 'token_relacionado', 'creador', 'moderado', 'activo']
        }
      },
      {
        action: 'plugin::content-manager.explorer.read',
        subject: 'api::foro.foro',
        conditions: [],
        properties: {
          fields: ['titulo', 'descripcion', 'token_relacionado', 'creador', 'moderado', 'activo']
        }
      },
      {
        action: 'plugin::content-manager.explorer.update',
        subject: 'api::foro.foro',
        conditions: [],
        properties: {
          fields: ['titulo', 'descripcion', 'token_relacionado', 'moderado', 'activo']
        }
      },
      {
        action: 'plugin::content-manager.explorer.delete',
        subject: 'api::foro.foro',
        conditions: [],
        properties: {}
      },

      // Permisos para Content Manager - Solo Comentarios
      {
        action: 'plugin::content-manager.explorer.create',
        subject: 'api::comentario.comentario',
        conditions: [],
        properties: {
          fields: ['texto', 'usuario', 'foro_relacionado', 'aprobado']
        }
      },
      {
        action: 'plugin::content-manager.explorer.read',
        subject: 'api::comentario.comentario',
        conditions: [],
        properties: {
          fields: ['texto', 'usuario', 'foro_relacionado', 'aprobado', 'createdAt']
        }
      },
      {
        action: 'plugin::content-manager.explorer.update',
        subject: 'api::comentario.comentario',
        conditions: [],
        properties: {
          fields: ['aprobado']
        }
      },
      {
        action: 'plugin::content-manager.explorer.delete',
        subject: 'api::comentario.comentario',
        conditions: [],
        properties: {}
      },

      // Permisos para Users-Permissions - Solo lectura de usuarios para moderar
      {
        action: 'plugin::content-manager.explorer.read',
        subject: 'plugin::users-permissions.user',
        conditions: [],
        properties: {
          fields: ['username', 'email', 'blocked', 'confirmed']
        }
      },
      {
        action: 'plugin::content-manager.explorer.update',
        subject: 'plugin::users-permissions.user',
        conditions: [],
        properties: {
          fields: ['blocked'] // Solo puede bloquear/desbloquear usuarios
        }
      },

      // Permisos básicos del admin panel
      {
        action: 'admin::marketplace.read',
        subject: null,
        conditions: [],
        properties: {}
      },
      {
        action: 'admin::webhooks.read',
        subject: null,
        conditions: [],
        properties: {}
      }
    ];

    // Crear los permisos para el rol de moderador
    for (const permission of permissions) {
      await strapi.query('admin::permission').create({
        data: {
          ...permission,
          role: moderatorRole.id
        }
      });
    }

    console.log('✅ Permisos de moderador configurados');
    return moderatorRole;

  } catch (error) {
    console.error('❌ Error configurando rol de moderador:', error.message);
    return null;
  }
};

const setupModeratorUser = async () => {
  try {
    console.log('👤 Configurando usuario moderador en Strapi Admin...');

    // Verificar si ya existe el usuario moderador en admin
    const existingAdminUser = await strapi.query('admin::user').findOne({
      where: { email: 'giovanoti2@gmail.com' }
    });

    if (existingAdminUser) {
      console.log('✅ Usuario moderador admin ya existe');
      return existingAdminUser;
    }

    // Obtener el rol de moderador
    const moderatorRole = await strapi.query('admin::role').findOne({
      where: { code: 'moderator' }
    });

    if (!moderatorRole) {
      console.log('❌ Rol de moderador no encontrado');
      return null;
    }

    // Crear usuario administrador con rol de moderador
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('moderator123', 12);

    const moderatorUser = await strapi.query('admin::user').create({
      data: {
        firstname: 'Giovanni',
        lastname: 'Moderador',
        username: 'giovanoti2',
        email: 'giovanoti2@gmail.com',
        password: hashedPassword,
        isActive: true,
        blocked: false,
        preferedLanguage: 'es'
      }
    });

    // Asignar el rol de moderador al usuario
    await strapi.query('admin::user').update({
      where: { id: moderatorUser.id },
      data: {
        roles: [moderatorRole.id]
      }
    });

    console.log('✅ Usuario moderador admin creado:', moderatorUser.email);
    return moderatorUser;

  } catch (error) {
    console.error('❌ Error configurando usuario moderador admin:', error.message);
    return null;
  }
};

module.exports = async () => {
  try {
    console.log('🚀 Iniciando configuración de moderador para Strapi Admin...');
    
    const moderatorRole = await setupModeratorRole();
    if (moderatorRole) {
      await setupModeratorUser();
    }
    
    console.log('🎉 Configuración de moderador completada!');
  } catch (error) {
    console.error('❌ Error en configuración de moderador:', error);
  }
};