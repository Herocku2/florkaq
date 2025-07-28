'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::votacion.votacion');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/votaciones',
      handler: 'votacion.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/votaciones/:id',
      handler: 'votacion.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/votaciones/activas',
      handler: 'votacion.findActivas',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ]
};