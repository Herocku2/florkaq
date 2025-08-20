module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/custom-register',
      handler: 'Auth.customRegister',
      config: {
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/custom-login',
      handler: 'Auth.customLogin',
      config: {
        middlewares: [],
      },
    },
  ],
};