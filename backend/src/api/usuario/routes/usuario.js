'use strict';

module.exports = {
  routes: [
    // Rutas personalizadas de autenticación
    {
      method: 'POST',
      path: '/usuario/register',
      handler: 'usuario.register',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/usuario/login',
      handler: 'usuario.login',
      config: {
        middlewares: [],
      },
    },
  ],
};