'use strict';

/**
 * usuario service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::usuario.usuario', ({ strapi }) => ({
  // Servicio para crear usuario con rol específico
  async crearUsuarioConRol(userData, rol = 'usuario') {
    try {
      const usuario = await strapi.entityService.create('api::usuario.usuario', {
        data: {
          ...userData,
          rol: rol,
          fechaRegistro: new Date(),
          activo: true
        }
      });

      strapi.log.info(`Usuario ${usuario.nombre} creado con rol ${rol}`);
      return usuario;
    } catch (error) {
      strapi.log.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Servicio para cambiar rol de usuario
  async cambiarRol(usuarioId, nuevoRol) {
    try {
      const rolesValidos = ['usuario', 'moderador', 'admin'];
      
      if (!rolesValidos.includes(nuevoRol)) {
        throw new Error('Rol inválido');
      }

      const usuario = await strapi.entityService.update('api::usuario.usuario', usuarioId, {
        data: {
          rol: nuevoRol
        }
      });

      strapi.log.info(`Rol de usuario ${usuario.nombre} cambiado a ${nuevoRol}`);
      return usuario;
    } catch (error) {
      strapi.log.error('Error cambiando rol:', error);
      throw error;
    }
  },

  // Servicio para obtener usuarios por rol
  async obtenerUsuariosPorRol(rol) {
    try {
      const usuarios = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: {
          rol: rol,
          activo: true
        },
        sort: { fechaRegistro: 'desc' }
      });

      return usuarios;
    } catch (error) {
      strapi.log.error('Error obteniendo usuarios por rol:', error);
      throw error;
    }
  },

  // Servicio para validar wallet de Solana
  async validarWalletSolana(walletAddress) {
    // Validación básica de formato de dirección de Solana
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
    if (!solanaAddressRegex.test(walletAddress)) {
      throw new Error('Formato de dirección de wallet inválido');
    }

    // Verificar que no exista otro usuario con la misma wallet
    const existingUser = await strapi.entityService.findMany('api::usuario.usuario', {
      filters: {
        walletSolana: walletAddress
      }
    });

    if (existingUser.length > 0) {
      throw new Error('Esta wallet ya está conectada a otra cuenta');
    }

    return true;
  },

  // Servicio para obtener estadísticas generales de usuarios
  async obtenerEstadisticasGenerales() {
    try {
      const [totalUsuarios, usuarios, moderadores, admins, usuariosConWallet] = await Promise.all([
        strapi.entityService.count('api::usuario.usuario', {
          filters: { activo: true }
        }),
        strapi.entityService.count('api::usuario.usuario', {
          filters: { rol: 'usuario', activo: true }
        }),
        strapi.entityService.count('api::usuario.usuario', {
          filters: { rol: 'moderador', activo: true }
        }),
        strapi.entityService.count('api::usuario.usuario', {
          filters: { rol: 'admin', activo: true }
        }),
        strapi.entityService.count('api::usuario.usuario', {
          filters: { 
            walletSolana: { $notNull: true },
            activo: true 
          }
        })
      ]);

      return {
        totalUsuarios,
        usuarios,
        moderadores,
        admins,
        usuariosConWallet,
        porcentajeConWallet: totalUsuarios > 0 ? (usuariosConWallet / totalUsuarios * 100).toFixed(2) : 0
      };
    } catch (error) {
      strapi.log.error('Error obteniendo estadísticas generales:', error);
      throw error;
    }
  }
}));