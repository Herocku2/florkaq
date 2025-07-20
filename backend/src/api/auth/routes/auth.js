'use strict';

/**
 * Auth routes personalizadas
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local/register',
      handler: 'auth.register',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.login',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ]
};