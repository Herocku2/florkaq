'use strict';

// Script para crear usuarios de ejemplo
module.exports = async ({ strapi }) => {
  console.log('🌱 Creando usuarios de ejemplo...');

  try {
    // Crear usuarios de ejemplo en la colección usuarios
    const usuariosEjemplo = [
      {
        nombre: 'Admin Principal',
        email: 'admin@florkafun.com',
        rol: 'admin',
        walletSolana: null,
        activo: true
      },
      {
        nombre: 'Moderador Forum',
        email: 'moderador@florkafun.com',
        rol: 'moderador',
        walletSolana: null,
        activo: true
      },
      {
        nombre: 'Usuario Estándar',
        email: 'usuario@florkafun.com',
        rol: 'usuario',
        walletSolana: null,
        activo: true
      },
      {
        nombre: 'CryptoFan123',
        email: 'cryptofan@example.com',
        rol: 'usuario',
        walletSolana: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        activo: true
      },
      {
        nombre: 'TokenExpert',
        email: 'expert@example.com',
        rol: 'moderador',
        walletSolana: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv',
        activo: true
      }
    ];

    for (const userData of usuariosEjemplo) {
      // Verificar si el usuario ya existe
      const existingUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: userData.email }
      });

      if (existingUser.length === 0) {
        await strapi.entityService.create('api::usuario.usuario', {
          data: userData
        });
        console.log(`✅ Usuario creado: ${userData.nombre} (${userData.rol})`);
      } else {
        console.log(`⚠️ Usuario ya existe: ${userData.email}`);
      }
    }

    // Crear usuarios en el sistema de autenticación de Strapi
    const authUsers = [
      {
        username: 'admin',
        email: 'admin@florkafun.com',
        password: 'admin123',
        confirmed: true,
        blocked: false
      },
      {
        username: 'moderador',
        email: 'moderador@florkafun.com',
        password: 'mod123',
        confirmed: true,
        blocked: false
      },
      {
        username: 'usuario',
        email: 'usuario@florkafun.com',
        password: 'user123',
        confirmed: true,
        blocked: false
      }
    ];

    for (const authUser of authUsers) {
      // Verificar si el usuario de auth ya existe
      const existingAuthUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: authUser.email }
      });

      if (!existingAuthUser) {
        // Obtener el rol authenticated
        const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: 'authenticated' }
        });

        await strapi.query('plugin::users-permissions.user').create({
          data: {
            ...authUser,
            role: authenticatedRole.id
          }
        });
        console.log(`✅ Usuario de auth creado: ${authUser.email}`);
      } else {
        console.log(`⚠️ Usuario de auth ya existe: ${authUser.email}`);
      }
    }

    console.log('✅ Usuarios de ejemplo creados exitosamente');
  } catch (error) {
    console.error('❌ Error creando usuarios de ejemplo:', error);
  }
};