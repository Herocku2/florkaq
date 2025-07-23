'use strict';

/**
 * forum-admin-routes router
 * Rutas administrativas para el sistema FORUM
 */

module.exports = {
  routes: [
    // Rutas administrativas para temas del foro
    {
      method: 'GET',
      path: '/admin/forum/topics',
      handler: 'forum-admin.getForumTopicsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/forum/topics/:topicId/moderate',
      handler: 'forum-admin.moderateForumTopic',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para comentarios
    {
      method: 'GET',
      path: '/admin/forum/comments',
      handler: 'forum-admin.getCommentsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/forum/comments/:commentId/moderate',
      handler: 'forum-admin.moderateComment',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para usuarios del foro
    {
      method: 'GET',
      path: '/admin/forum/users',
      handler: 'forum-admin.getForumUsersAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/forum/users/:userId/manage',
      handler: 'forum-admin.manageForumUser',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para categorías del foro
    {
      method: 'GET',
      path: '/admin/forum/categories',
      handler: 'forum-admin.getForumCategoriesAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/forum/categories',
      handler: 'forum-admin.createForumCategory',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas del foro
    {
      method: 'GET',
      path: '/admin/forum/stats',
      handler: 'forum-admin.getForumStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};