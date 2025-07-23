'use strict';

/**
 * forum-routes router
 * Rutas específicas para el sistema FORUM (Foros Comunitarios)
 */

module.exports = {
  routes: [
    // Rutas públicas para foros
    {
      method: 'GET',
      path: '/forum/topics',
      handler: 'community-forum.getForumTopics',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/forum/topic/:topicId',
      handler: 'community-forum.getForumTopic',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/forum/categories',
      handler: 'community-forum.getForumCategories',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    
    // Rutas que requieren autenticación
    {
      method: 'POST',
      path: '/forum/topics',
      handler: 'community-forum.createForumTopic',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/forum/topic/:topicId/reply',
      handler: 'community-forum.createTopicReply',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    
    // Rutas para moderadores/admins
    {
      method: 'PUT',
      path: '/forum/topic/:topicId/moderate',
      handler: 'community-forum.moderateTopic',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};