'use strict';

/**
 * ranking router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rankings',
      handler: 'ranking.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/rankings/:id',
      handler: 'ranking.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/rankings/page/:pagina',
      handler: 'ranking.findByPage',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ]
};