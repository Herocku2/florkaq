'use strict';

const seedUsers = require('./seed-users');

module.exports = async ({ strapi }) => {
  console.log('🚀 Iniciando configuración de permisos y datos iniciales...');

  try {
    // Configurar permisos para el rol público (public)
    await configurePublicPermissions(strapi);
    
    // Configurar permisos para usuarios autenticados
    await configureAuthenticatedPermissions(strapi);
    
    // Crear usuarios de ejemplo
    await seedUsers({ strapi });
    
    console.log('✅ Configuración completada');
  } catch (error) {
    console.error('❌ Error en configuración:', error);
  }
};

async function configurePublicPermissions(strapi) {
  console.log('🔓 Configurando permisos públicos...');
  
  // Obtener el rol público
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' }
  });

  if (!publicRole) {
    console.error('❌ No se encontró el rol público');
    return;
  }

  // Permisos públicos para foros (solo lectura)
  const publicPermissions = [
    // Foros - lectura
    { action: 'api::foro.foro.find', enabled: true },
    { action: 'api::foro.foro.findOne', enabled: true },
    { action: 'api::foro.foro.getComments', enabled: true },
    
    // Comentarios - lectura
    { action: 'api::comentario.comentario.find', enabled: true },
    { action: 'api::comentario.comentario.findOne', enabled: true },
    
    // Candidatos - lectura (para el sistema de votación)
    { action: 'api::candidato.candidato.find', enabled: true },
    { action: 'api::candidato.candidato.findOne', enabled: true },
    
    // Tokens - lectura
    { action: 'api::token.token.find', enabled: true },
    { action: 'api::token.token.findOne', enabled: true },
    
    // Rankings - lectura
    { action: 'api::ranking.ranking.find', enabled: true },
    { action: 'api::ranking.ranking.findOne', enabled: true }
  ];

  for (const permission of publicPermissions) {
    try {
      await updatePermission(strapi, publicRole.id, permission.action, permission.enabled);
      console.log(`✅ Permiso público configurado: ${permission.action}`);
    } catch (error) {
      console.log(`⚠️ Error configurando permiso público ${permission.action}:`, error.message);
    }
  }
}

async function configureAuthenticatedPermissions(strapi) {
  console.log('🔐 Configurando permisos para usuarios autenticados...');
  
  // Obtener el rol autenticado
  const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'authenticated' }
  });

  if (!authenticatedRole) {
    console.error('❌ No se encontró el rol autenticado');
    return;
  }

  // Permisos para usuarios autenticados estándar
  const authenticatedPermissions = [
    // Foros - solo lectura y comentarios (NO crear foros)
    { action: 'api::foro.foro.find', enabled: true },
    { action: 'api::foro.foro.findOne', enabled: true },
    { action: 'api::foro.foro.getComments', enabled: true },
    { action: 'api::foro.foro.createComment', enabled: true },
    
    // Comentarios - lectura y creación
    { action: 'api::comentario.comentario.find', enabled: true },
    { action: 'api::comentario.comentario.findOne', enabled: true },
    { action: 'api::comentario.comentario.create', enabled: true },
    
    // Votaciones - participar
    { action: 'api::voto.voto.create', enabled: true },
    { action: 'api::voto.voto.update', enabled: true },
    { action: 'api::voto.voto.delete', enabled: true },
    
    // Candidatos - lectura
    { action: 'api::candidato.candidato.find', enabled: true },
    { action: 'api::candidato.candidato.findOne', enabled: true },
    
    // Usuarios - ver su propio perfil
    { action: 'api::usuario.usuario.findOne', enabled: true },
    { action: 'api::usuario.usuario.update', enabled: true },
    
    // Paquetes - ver y solicitar
    { action: 'api::paquete.paquete.find', enabled: true },
    { action: 'api::paquete.paquete.findOne', enabled: true },
    
    // Solicitudes de token - crear y ver propias
    { action: 'api::solicitud-token.solicitud-token.create', enabled: true },
    { action: 'api::solicitud-token.solicitud-token.find', enabled: true },
    { action: 'api::solicitud-token.solicitud-token.findOne', enabled: true }
  ];

  for (const permission of authenticatedPermissions) {
    try {
      await updatePermission(strapi, authenticatedRole.id, permission.action, permission.enabled);
      console.log(`✅ Permiso autenticado configurado: ${permission.action}`);
    } catch (error) {
      console.log(`⚠️ Error configurando permiso autenticado ${permission.action}:`, error.message);
    }
  }

  // Configurar permisos específicos para moderadores
  await configureModeratorsPermissions(strapi);
}

async function configureModeratorsPermissions(strapi) {
  console.log('👮 Configurando permisos para moderadores...');
  
  // Crear rol de moderador si no existe
  let moderatorRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { name: 'Moderador' }
  });

  if (!moderatorRole) {
    moderatorRole = await strapi.query('plugin::users-permissions.role').create({
      data: {
        name: 'Moderador',
        description: 'Rol para moderadores de foros',
        type: 'moderador'
      }
    });
    console.log('✅ Rol de moderador creado');
  }

  // Permisos para moderadores (incluye todo lo de usuarios + moderación)
  const moderatorPermissions = [
    // Foros - control total
    { action: 'api::foro.foro.find', enabled: true },
    { action: 'api::foro.foro.findOne', enabled: true },
    { action: 'api::foro.foro.create', enabled: true },
    { action: 'api::foro.foro.update', enabled: true },
    { action: 'api::foro.foro.delete', enabled: true },
    { action: 'api::foro.foro.getComments', enabled: true },
    { action: 'api::foro.foro.createComment', enabled: true },
    
    // Comentarios - control total
    { action: 'api::comentario.comentario.find', enabled: true },
    { action: 'api::comentario.comentario.findOne', enabled: true },
    { action: 'api::comentario.comentario.create', enabled: true },
    { action: 'api::comentario.comentario.update', enabled: true },
    { action: 'api::comentario.comentario.delete', enabled: true },
    
    // Usuarios - ver y moderar
    { action: 'api::usuario.usuario.find', enabled: true },
    { action: 'api::usuario.usuario.findOne', enabled: true },
    { action: 'api::usuario.usuario.update', enabled: true }
  ];

  for (const permission of moderatorPermissions) {
    try {
      await updatePermission(strapi, moderatorRole.id, permission.action, permission.enabled);
      console.log(`✅ Permiso moderador configurado: ${permission.action}`);
    } catch (error) {
      console.log(`⚠️ Error configurando permiso moderador ${permission.action}:`, error.message);
    }
  }
}

async function updatePermission(strapi, roleId, action, enabled) {
  // Buscar si ya existe el permiso
  const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
    where: {
      role: roleId,
      action: action
    }
  });

  if (existingPermission) {
    // Actualizar permiso existente
    await strapi.query('plugin::users-permissions.permission').update({
      where: { id: existingPermission.id },
      data: { enabled }
    });
  } else {
    // Crear nuevo permiso
    await strapi.query('plugin::users-permissions.permission').create({
      data: {
        action,
        enabled,
        policy: '',
        role: roleId
      }
    });
  }
}