'use strict';

/**
 * news-admin-routes router
 * Rutas administrativas para el sistema NEWS
 */

module.exports = {
  routes: [
    // Rutas administrativas para artículos de NEWS
    {
      method: 'GET',
      path: '/admin/news/articles',
      handler: 'news-admin.getNewsArticlesAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/news/articles',
      handler: 'news-admin.createNewsArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId',
      handler: 'news-admin.updateNewsArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId/status',
      handler: 'news-admin.changeArticleStatus',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/news/articles/:articleId/publish',
      handler: 'news-admin.publishArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/news/articles/:articleId/schedule',
      handler: 'news-admin.scheduleArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId/highlight',
      handler: 'news-admin.toggleArticleHighlight',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/news/articles/:articleId',
      handler: 'news-admin.archiveArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para categorías de NEWS
    {
      method: 'GET',
      path: '/admin/news/categories',
      handler: 'news-admin.getNewsCategoriesAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/news/categories',
      handler: 'news-admin.createNewsCategory',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas de NEWS
    {
      method: 'GET',
      path: '/admin/news/stats',
      handler: 'news-admin.getNewsStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};