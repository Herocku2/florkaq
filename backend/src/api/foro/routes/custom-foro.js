'use strict';

module.exports = {
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