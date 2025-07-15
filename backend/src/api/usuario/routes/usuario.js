'use strict';

/**
 * usuario router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::usuario.usuario');

// Rutas personalizadas
const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/usuarios/me',
      handler: 'usuario.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/usuarios/conectar-wallet',
      handler: 'usuario.conectarWallet',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/usuarios/estadisticas',
      handler: 'usuario.estadisticas',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

module.exports = defaultRouter;