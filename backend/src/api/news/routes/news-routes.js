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
    },
    {
      method: 'GET',
      path: '/news/categories',
      handler: 'news-management.getNewsCategories',
    },
    {
      method: 'GET',
      path: '/news/article/:slug',
      handler: 'news-management.getArticleBySlug',
    },
    
    // Rutas administrativas para noticias
    {
      method: 'POST',
      path: '/news/admin/articles',
      handler: 'news-management.createArticle',
    },
    {
      method: 'PUT',
      path: '/news/admin/articles/:id/publish',
      handler: 'news-management.publishArticle',
    },
  ],
};