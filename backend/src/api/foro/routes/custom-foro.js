'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/foros/:id/comentarios',
      handler: 'foro.getComments',
      config: {
        auth: false,
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/foros/:id/comentarios',
      handler: 'foro.createComment',
      config: {
        auth: false,
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/foros/check-moderator',
      handler: 'foro.checkModerator',
      config: {
        auth: false,
        middlewares: [],
      },
    },
  ],
};