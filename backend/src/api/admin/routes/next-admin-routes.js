'use strict';

/**
 * next-admin-routes router
 * Rutas administrativas para el sistema NEXT
 */

module.exports = {
  routes: [
    // Rutas administrativas para proyectos NEXT
    {
      method: 'GET',
      path: '/admin/next/projects',
      handler: 'next-management.getNextProjectsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/next/projects',
      handler: 'next-management.createNextProject',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId',
      handler: 'next-management.updateNextProject',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId/status',
      handler: 'next-management.changeProjectStatus',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId/schedule',
      handler: 'next-management.scheduleProjectLaunch',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/next/projects/:projectId',
      handler: 'next-management.deleteNextProject',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas para Top 3 proyectos NEXT
    {
      method: 'GET',
      path: '/admin/next/top3',
      handler: 'next-management.getTop3NextProjects',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/next/top3',
      handler: 'next-management.updateTop3NextProjects',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas de NEXT
    {
      method: 'GET',
      path: '/admin/next/stats',
      handler: 'next-management.getNextStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};