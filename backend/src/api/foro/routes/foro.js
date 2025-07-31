'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

// Rutas por defecto
const defaultRouter = createCoreRouter('api::foro.foro');

// Rutas personalizadas
const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/foros/:id/comentarios',
      handler: 'foro.getComments',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/foros/:id/comentarios',
      handler: 'foro.createComment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/foros/check-moderator',
      handler: 'foro.checkModerator',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};

// Combinar rutas
module.exports = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes.routes
  ]
};