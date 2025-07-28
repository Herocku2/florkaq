'use strict';

/**
 * candidato router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/candidatos',
      handler: 'candidato.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/candidatos/:id',
      handler: 'candidato.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/candidatos/activos',
      handler: 'candidato.findActivos',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ]
};