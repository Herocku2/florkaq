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
    },
    {
      method: 'POST',
      path: '/admin/news/articles',
      handler: 'news-admin.createNewsArticle',
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId',
      handler: 'news-admin.updateNewsArticle',
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId/status',
      handler: 'news-admin.changeArticleStatus',
    },
    {
      method: 'POST',
      path: '/admin/news/articles/:articleId/publish',
      handler: 'news-admin.publishArticle',
    },
    {
      method: 'POST',
      path: '/admin/news/articles/:articleId/schedule',
      handler: 'news-admin.scheduleArticle',
    },
    {
      method: 'PUT',
      path: '/admin/news/articles/:articleId/highlight',
      handler: 'news-admin.toggleArticleHighlight',
    },
    {
      method: 'DELETE',
      path: '/admin/news/articles/:articleId',
      handler: 'news-admin.archiveArticle',
    },
    
    // Rutas administrativas para categorías de NEWS
    {
      method: 'GET',
      path: '/admin/news/categories',
      handler: 'news-admin.getNewsCategoriesAdmin',
    },
    {
      method: 'POST',
      path: '/admin/news/categories',
      handler: 'news-admin.createNewsCategory',
    },
    
    // Estadísticas de NEWS
    {
      method: 'GET',
      path: '/admin/news/stats',
      handler: 'news-admin.getNewsStats',
    },
  ],
};