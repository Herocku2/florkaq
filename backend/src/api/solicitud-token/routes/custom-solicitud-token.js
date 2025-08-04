module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/solicitud-tokens/stats',
      handler: 'solicitud-token.getStats',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};