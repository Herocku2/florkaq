'use strict';

/**
 * news-routes router
 * Rutas específicas para el sistema NEWS
 */

module.exports = {
  routes: [
    // Rutas públicas para noticias
    {
      method: 'GET',
      path: '/news/articles',
      handler: 'news-management.getNewsArticles',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/news/categories',
      handler: 'news-management.getNewsCategories',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/news/article/:slug',
      handler: 'news-management.getArticleBySlug',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para noticias
    {
      method: 'POST',
      path: '/news/admin/articles',
      handler: 'news-management.createArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/news/admin/articles/:id/publish',
      handler: 'news-management.publishArticle',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};