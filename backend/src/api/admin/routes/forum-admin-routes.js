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
    },
    {
      method: 'PUT',
      path: '/admin/forum/topics/:topicId/moderate',
      handler: 'forum-admin.moderateForumTopic',
    },
    
    // Rutas administrativas para comentarios
    {
      method: 'GET',
      path: '/admin/forum/comments',
      handler: 'forum-admin.getCommentsAdmin',
    },
    {
      method: 'PUT',
      path: '/admin/forum/comments/:commentId/moderate',
      handler: 'forum-admin.moderateComment',
    },
    
    // Rutas administrativas para usuarios del foro
    {
      method: 'GET',
      path: '/admin/forum/users',
      handler: 'forum-admin.getForumUsersAdmin',
    },
    {
      method: 'PUT',
      path: '/admin/forum/users/:userId/manage',
      handler: 'forum-admin.manageForumUser',
    },
    
    // Rutas administrativas para categorías del foro
    {
      method: 'GET',
      path: '/admin/forum/categories',
      handler: 'forum-admin.getForumCategoriesAdmin',
    },
    {
      method: 'POST',
      path: '/admin/forum/categories',
      handler: 'forum-admin.createForumCategory',
    },
    
    // Estadísticas del foro
    {
      method: 'GET',
      path: '/admin/forum/stats',
      handler: 'forum-admin.getForumStats',
    },
  ],
};