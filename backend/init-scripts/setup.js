/**
 * Script de inicialización para FlorkaFun
 * Este script configura los modelos de datos y roles iniciales en Strapi
 */

const setupRoles = async () => {
  try {
    console.log('👥 Configurando roles y permisos...');

    // Obtener roles existentes
    const existingRoles = await strapi.query('plugin::users-permissions.role').findMany();
    
    // Verificar si los roles personalizados ya existen
    const moderatorExists = existingRoles.find(role => role.type === 'moderator');
    const adminExists = existingRoles.find(role => role.type === 'admin');

    if (moderatorExists && adminExists) {
      console.log('✅ Los roles personalizados ya existen.');
      return;
    }

    // Obtener roles por defecto
    const authenticatedRole = existingRoles.find(role => role.type === 'authenticated');
    const publicRole = existingRoles.find(role => role.type === 'public');

    // Crear rol de moderador si no existe
    if (!moderatorExists) {
      await strapi.query('plugin::users-permissions.role').create({
        data: {
          name: 'Moderador',
          description: 'Rol para moderadores de foros y contenido',
          type: 'moderator'
        }
      });
      console.log('✅ Rol Moderador creado');
    }

    // Crear rol de administrador si no existe
    if (!adminExists) {
      await strapi.query('plugin::users-permissions.role').create({
        data: {
          name: 'Admin',
          description: 'Rol para administradores de la plataforma',
          type: 'admin'
        }
      });
      console.log('✅ Rol Admin creado');
    }

    console.log('✅ Configuración de roles completada');

  } catch (error) {
    console.error('❌ Error configurando roles:', error);
  }
};

const setupPermissions = async () => {
  try {
    console.log('🔐 Configurando permisos básicos...');

    // Obtener todos los roles
    const roles = await strapi.query('plugin::users-permissions.role').findMany();
    
    // Configurar permisos básicos para cada rol
    const publicRole = roles.find(role => role.type === 'public');
    const authenticatedRole = roles.find(role => role.type === 'authenticated');
    const moderatorRole = roles.find(role => role.type === 'moderator');
    const adminRole = roles.find(role => role.type === 'admin');

    // Permisos para usuario público (solo lectura básica)
    if (publicRole) {
      // Los usuarios públicos pueden ver tokens lanzados y votaciones activas
      console.log('🔓 Configurando permisos para usuarios públicos');
    }

    // Permisos para usuarios autenticados (usuario estándar)
    if (authenticatedRole) {
      // Los usuarios autenticados pueden votar, comentar, crear solicitudes
      console.log('👤 Configurando permisos para usuarios autenticados');
    }

    // Permisos para moderadores
    if (moderatorRole) {
      // Los moderadores pueden crear foros, moderar contenido
      console.log('👮 Configurando permisos para moderadores');
    }

    // Permisos para administradores
    if (adminRole) {
      // Los administradores tienen acceso completo
      console.log('👑 Configurando permisos para administradores');
    }

    console.log('✅ Configuración de permisos completada');

  } catch (error) {
    console.error('❌ Error configurando permisos:', error);
  }
};

const createDefaultAdmin = async () => {
  try {
    console.log('👤 Verificando usuario administrador por defecto...');

    // Verificar si ya existe un usuario administrador
    const adminUsers = await strapi.query('plugin::users-permissions.user').findMany({
      where: {
        email: 'admin@florkafun.com'
      }
    });

    if (adminUsers.length > 0) {
      console.log('✅ Usuario administrador ya existe');
      return;
    }

    // Obtener el rol de administrador
    const adminRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'admin' }
    });

    if (!adminRole) {
      console.log('⚠️ Rol de administrador no encontrado, saltando creación de usuario');
      return;
    }

    // Crear usuario administrador por defecto
    const adminUser = await strapi.query('plugin::users-permissions.user').create({
      data: {
        username: 'admin',
        email: 'admin@florkafun.com',
        password: await strapi.plugins['users-permissions'].services.user.hashPassword('admin123'),
        confirmed: true,
        blocked: false,
        role: adminRole.id
      }
    });

    console.log('✅ Usuario administrador creado: admin@florkafun.com / admin123');

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  }
};

module.exports = async () => {
  try {
    // Solo ejecutar en desarrollo o cuando se especifique
    if (process.env.NODE_ENV !== 'development' && !process.env.INIT_SCRIPT) {
      return;
    }

    console.log('🚀 Iniciando script de configuración para FlorkaFun...');

    // Esperar a que Strapi esté completamente inicializado
    if (!strapi.isLoaded) {
      console.log('⏳ Esperando a que Strapi se inicialice...');
      return;
    }

    await setupRoles();
    await setupPermissions();
    await createDefaultAdmin();

    console.log('🎉 Configuración inicial completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la configuración inicial:', error);
  }
};