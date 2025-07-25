'use strict';

/**
 * candidato router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::candidato.candidato', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
  }
});

// Agregar rutas personalizadas
module.exports.routes = [
  ...module.exports.routes,
  {
    method: 'GET',
    path: '/candidatos/activos',
    handler: 'candidato.findActivos',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];