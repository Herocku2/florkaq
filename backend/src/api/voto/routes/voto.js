'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::voto.voto');

const customRoutes = {
  routes: [
    // Rutas por defecto
    ...defaultRouter.routes,
    
    // Rutas personalizadas para votación
    {
      method: 'GET',
      path: '/votos/user/:usuario',
      handler: 'voto.findUserVotes',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/votos/count/:candidato',
      handler: 'voto.getVoteCount',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/votos/stats',
      handler: 'voto.getVotingStats',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};

module.exports = customRoutes;