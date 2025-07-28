/**
 * Script para configurar permisos públicos para las APIs
 */

const setupPublicPermissions = async () => {
  try {
    console.log('🔓 Configurando permisos públicos...');

    // Obtener el rol público
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.log('❌ Rol público no encontrado');
      return;
    }

    // APIs que necesitan ser públicas
    const publicAPIs = [
      // Candidatos
      { controller: 'api::candidato.candidato', action: 'find' },
      { controller: 'api::candidato.candidato', action: 'findOne' },
      
      // Votaciones
      { controller: 'api::votacion.votacion', action: 'find' },
      { controller: 'api::votacion.votacion', action: 'findOne' },
      { controller: 'api::votacion.votacion', action: 'findActivas' },
      
      // Tokens
      { controller: 'api::token.token', action: 'find' },
      { controller: 'api::token.token', action: 'findOne' },
      
      // Rankings
      { controller: 'api::ranking.ranking', action: 'find' },
      { controller: 'api::ranking.ranking', action: 'findOne' },
      
      // Votos (solo lectura)
      { controller: 'api::voto.voto', action: 'find' },
      { controller: 'api::voto.voto', action: 'getVoteCount' },
      { controller: 'api::voto.voto', action: 'getVotingStats' }
    ];

    // Configurar permisos
    for (const api of publicAPIs) {
      try {
        // Buscar si ya existe el permiso
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            role: publicRole.id,
            controller: api.controller,
            action: api.action
          }
        });

        if (!existingPermission) {
          // Crear nuevo permiso
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              role: publicRole.id,
              controller: api.controller,
              action: api.action,
              enabled: true
            }
          });
          console.log(`✅ Permiso creado: ${api.controller}.${api.action}`);
        } else {
          // Actualizar permiso existente
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true }
          });
          console.log(`✅ Permiso actualizado: ${api.controller}.${api.action}`);
        }
      } catch (error) {
        console.error(`❌ Error configurando permiso ${api.controller}.${api.action}:`, error.message);
      }
    }

    console.log('✅ Permisos públicos configurados');

  } catch (error) {
    console.error('❌ Error configurando permisos públicos:', error);
  }
};

module.exports = setupPublicPermissions;