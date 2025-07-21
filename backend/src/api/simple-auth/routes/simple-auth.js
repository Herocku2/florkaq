'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/simple-auth/register',
      handler: 'simple-auth.register',
      config: {
        auth: false, // Desactivar autenticación para esta ruta
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/simple-auth/login',
      handler: 'simple-auth.login',
      config: {
        auth: false, // Desactivar autenticación para esta ruta
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/simple-auth/me',
      handler: 'simple-auth.me',
      config: {
        auth: false, // Desactivar autenticación para esta ruta
        policies: [],
        middlewares: [],
      },
    },
  ],
};