'use strict';

/**
 * token router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::token.token');

// Rutas personalizadas
const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/tokens/lanzados',
      handler: 'token.findLanzados',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tokens/proximos',
      handler: 'token.findProximos',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tokens/candidatos',
      handler: 'token.findCandidatos',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

// Combinar rutas por defecto con rutas personalizadas
module.exports = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes.routes,
  ],
};