'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'auth.register',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.me',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/auth/profile',
      handler: 'auth.updateProfile',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/auth/change-password',
      handler: 'auth.changePassword',
      config: {
        middlewares: [],
      },
    },
  ],
};