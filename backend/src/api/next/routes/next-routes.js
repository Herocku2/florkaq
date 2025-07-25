'use strict';

/**
 * next-routes router
 * Rutas específicas para la página NEXT (Próximos Lanzamientos)
 */

module.exports = {
  routes: [
    // Rutas públicas para próximos proyectos
    {
      method: 'GET',
      path: '/next/projects',
      handler: 'next-projects.getNextProjects',
    },
    {
      method: 'GET',
      path: '/next/schedule',
      handler: 'next-projects.getNextSchedule',
    },
    {
      method: 'GET',
      path: '/next/project/:id',
      handler: 'next-projects.getNextProjectById',
    },
    
    // Rutas que requieren autenticación
    {
      method: 'POST',
      path: '/next/project/:projectId/reminder',
      handler: 'next-projects.createReminder',
    },
  ],
};