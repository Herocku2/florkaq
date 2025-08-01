'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/admin/users',
      handler: 'admin.listUsers',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/change-role',
      handler: 'admin.changeUserRole',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/user/:email',
      handler: 'admin.getUserInfo',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};