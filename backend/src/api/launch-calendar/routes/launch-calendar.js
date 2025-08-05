'use strict';

/**
 * launch-calendar router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::launch-calendar.launch-calendar');

const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/launch-calendar/available-dates',
      handler: 'launch-calendar.getAvailableDates',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/launch-calendar/reserve-date',
      handler: 'launch-calendar.reserveDate',
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
    ...customRoutes.routes,
  ],
};