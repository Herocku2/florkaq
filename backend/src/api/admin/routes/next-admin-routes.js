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
    },
    {
      method: 'POST',
      path: '/admin/next/projects',
      handler: 'next-management.createNextProject',
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId',
      handler: 'next-management.updateNextProject',
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId/status',
      handler: 'next-management.changeProjectStatus',
    },
    {
      method: 'PUT',
      path: '/admin/next/projects/:projectId/schedule',
      handler: 'next-management.scheduleProjectLaunch',
    },
    {
      method: 'DELETE',
      path: '/admin/next/projects/:projectId',
      handler: 'next-management.deleteNextProject',
    },
    
    // Rutas para Top 3 proyectos NEXT
    {
      method: 'GET',
      path: '/admin/next/top3',
      handler: 'next-management.getTop3NextProjects',
    },
    {
      method: 'PUT',
      path: '/admin/next/top3',
      handler: 'next-management.updateTop3NextProjects',
    },
    
    // Estadísticas de NEXT
    {
      method: 'GET',
      path: '/admin/next/stats',
      handler: 'next-management.getNextStats',
    },
  ],
};