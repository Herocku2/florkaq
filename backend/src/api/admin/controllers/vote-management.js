'use strict';

/**
 * vote-management controller
 * Controlador para el área administrativa de VOTE
 */

module.exports = {
  // Obtener todos los candidatos para administración
  async getVoteCandidatesAdmin(ctx) {
    try {
      console.log('🗳️👨‍💼 Admin: Accediendo a candidatos de VOTE');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, votacionId, activo } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (votacionId) {
        filters.votaciones = votacionId;
      }
      
      if (activo !== undefined) {
        filters.activo = activo === 'true';
      }
      
      // Buscar candidatos para administración
      const candidates = await strapi.entityService.findMany('api::token.token', {
        filters: {
          ...filters,
          estado: 'candidato'
        },
        populate: ['imagen', 'creador', 'votaciones'],
        sort: { orden: 'asc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      // Obtener votos para cada candidato
      const candidatesWithVotes = await Promise.all(
        candidates.data.map(async (candidate) => {
          const votes = await strapi.entityService.findMany('api::voto.voto', {
            filters: {
              candidatoVotado: candidate.id
            }
          });
          
          return {
            ...candidate,
            totalVotos: votes.data.length
          };
        })
      );
      
      return {
        data: candidatesWithVotes,
        meta: candidates.meta
      };
    } catch (error) {
      console.error('Error en getVoteCandidatesAdmin:', error);
      return ctx.badRequest('Error al obtener candidatos para administración');
    }
  },

  // Crear nuevo candidato
  async createVoteCandidate(ctx) {
    try {
      console.log('🗳️➕ Admin: Creando candidato de VOTE');
      
      const {
        nombre,
        simbolo,
        descripcion,
        orden,
        activo
      } = ctx.request.body.data;
      
      // Crear candidato
      const candidate = await strapi.entityService.create('api::token.token', {
        data: {
          nombre,
          simbolo,
          descripcion,
          orden: orden || 0,
          estado: 'candidato',
          activo: activo !== false,
          fechaCreacion: new Date().toISOString(),
          creador: ctx.state.user.id
        }
      });
      
      return { success: true, candidate };
    } catch (error) {
      console.error('Error en createVoteCandidate:', error);
      return ctx.badRequest('Error al crear candidato');
    }
  },

  // Actualizar candidato
  async updateVoteCandidate(ctx) {
    try {
      const { candidateId } = ctx.params;
      console.log(`🗳️✏️ Admin: Actualizando candidato ${candidateId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar candidato
      const candidate = await strapi.entityService.update('api::token.token', candidateId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, candidate };
    } catch (error) {
      console.error('Error en updateVoteCandidate:', error);
      return ctx.badRequest('Error al actualizar candidato');
    }
  },

  // Activar/desactivar candidato
  async toggleCandidateStatus(ctx) {
    try {
      const { candidateId } = ctx.params;
      const { activo } = ctx.request.body.data;
      
      console.log(`🗳️🔄 Admin: ${activo ? 'Activando' : 'Desactivando'} candidato ${candidateId}`);
      
      // Actualizar estado
      const candidate = await strapi.entityService.update('api::token.token', candidateId, {
        data: {
          activo,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, candidate };
    } catch (error) {
      console.error('Error en toggleCandidateStatus:', error);
      return ctx.badRequest('Error al cambiar estado del candidato');
    }
  },

  // Gestionar votaciones
  async getVotationsAdmin(ctx) {
    try {
      console.log('🗳️📊 Admin: Accediendo a votaciones');
      
      // Buscar votaciones
      const votations = await strapi.entityService.findMany('api::votacion.votacion', {
        populate: {
          candidatos: {
            populate: ['imagen']
          },
          tokenGanador: {
            populate: ['imagen']
          }
        },
        sort: { fechaCreacion: 'desc' }
      });
      
      return votations;
    } catch (error) {
      console.error('Error en getVotationsAdmin:', error);
      return ctx.badRequest('Error al obtener votaciones');
    }
  },

  // Crear nueva votación
  async createVotation(ctx) {
    try {
      console.log('🗳️➕ Admin: Creando votación');
      
      const {
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        candidatos,
        activa
      } = ctx.request.body.data;
      
      // Crear votación
      const votation = await strapi.entityService.create('api::votacion.votacion', {
        data: {
          titulo,
          descripcion,
          fechaInicio: fechaInicio || new Date().toISOString(),
          fechaFin: fechaFin || new Date(Date.now() + 86400000 * 7).toISOString(),
          candidatos: candidatos || [],
          activa: activa !== false,
          fechaCreacion: new Date().toISOString()
        }
      });
      
      return { success: true, votation };
    } catch (error) {
      console.error('Error en createVotation:', error);
      return ctx.badRequest('Error al crear votación');
    }
  },

  // Actualizar votación
  async updateVotation(ctx) {
    try {
      const { votationId } = ctx.params;
      console.log(`🗳️✏️ Admin: Actualizando votación ${votationId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar votación
      const votation = await strapi.entityService.update('api::votacion.votacion', votationId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, votation };
    } catch (error) {
      console.error('Error en updateVotation:', error);
      return ctx.badRequest('Error al actualizar votación');
    }
  },

  // Finalizar votación y determinar ganador
  async finalizeVotation(ctx) {
    try {
      const { votationId } = ctx.params;
      console.log(`🗳️🏆 Admin: Finalizando votación ${votationId}`);
      
      // Obtener votación con candidatos
      const votation = await strapi.entityService.findOne('api::votacion.votacion', votationId, {
        populate: {
          candidatos: true
        }
      });
      
      if (!votation) {
        return ctx.notFound('Votación no encontrada');
      }
      
      // Contar votos para cada candidato
      const candidateVotes = {};
      for (const candidate of votation.candidatos.data) {
        const votes = await strapi.entityService.findMany('api::voto.voto', {
          filters: {
            votacion: votationId,
            candidatoVotado: candidate.id
          }
        });
        candidateVotes[candidate.id] = votes.data.length;
      }
      
      // Determinar ganador
      let winnerId = null;
      let maxVotes = 0;
      for (const [candidateId, voteCount] of Object.entries(candidateVotes)) {
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winnerId = candidateId;
        }
      }
      
      // Actualizar votación con ganador
      const updatedVotation = await strapi.entityService.update('api::votacion.votacion', votationId, {
        data: {
          activa: false,
          tokenGanador: winnerId,
          fechaFinalizacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      // Si hay ganador, crear proyecto NEXT
      if (winnerId) {
        const winner = await strapi.entityService.findOne('api::token.token', winnerId);
        
        // Crear proyecto NEXT basado en el ganador
        await strapi.entityService.create('api::token.token', {
          data: {
            nombre: winner.nombre,
            simbolo: winner.simbolo,
            descripcion: winner.descripcion,
            imagen: winner.imagen,
            estado: 'proximo',
            fechaLanzamiento: new Date(Date.now() + 86400000 * 7).toISOString(), // Próximo viernes
            fechaCreacion: new Date().toISOString(),
            origenVotacion: votationId,
            creador: winner.creador
          }
        });
      }
      
      return { success: true, votation: updatedVotation, winnerId, totalVotes: maxVotes };
    } catch (error) {
      console.error('Error en finalizeVotation:', error);
      return ctx.badRequest('Error al finalizar votación');
    }
  },

  // Eliminar candidato (soft delete)
  async deleteVoteCandidate(ctx) {
    try {
      const { candidateId } = ctx.params;
      console.log(`🗳️🗑️ Admin: Eliminando candidato ${candidateId}`);
      
      // Cambiar estado a inactivo en lugar de eliminar
      const candidate = await strapi.entityService.update('api::token.token', candidateId, {
        data: {
          activo: false,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, message: 'Candidato desactivado correctamente' };
    } catch (error) {
      console.error('Error en deleteVoteCandidate:', error);
      return ctx.badRequest('Error al eliminar candidato');
    }
  },

  // Obtener estadísticas de votaciones
  async getVoteStats(ctx) {
    try {
      console.log('🗳️📊 Admin: Obteniendo estadísticas de VOTE');
      
      // Contar candidatos y votaciones
      const totalCandidates = await strapi.entityService.count('api::token.token', {
        filters: { estado: 'candidato' }
      });
      const activeCandidates = await strapi.entityService.count('api::token.token', {
        filters: { estado: 'candidato', activo: true }
      });
      const totalVotations = await strapi.entityService.count('api::votacion.votacion');
      const activeVotations = await strapi.entityService.count('api::votacion.votacion', {
        filters: { activa: true }
      });
      
      // Obtener total de votos
      const totalVotes = await strapi.entityService.count('api::voto.voto');
      
      // Obtener candidatos más votados
      const candidates = await strapi.entityService.findMany('api::token.token', {
        filters: { estado: 'candidato', activo: true },
        populate: ['imagen']
      });
      
      const candidatesWithVotes = await Promise.all(
        candidates.data.map(async (candidate) => {
          const votes = await strapi.entityService.findMany('api::voto.voto', {
            filters: { candidatoVotado: candidate.id }
          });
          return {
            ...candidate,
            totalVotos: votes.data.length
          };
        })
      );
      
      const topCandidates = candidatesWithVotes
        .sort((a, b) => b.totalVotos - a.totalVotos)
        .slice(0, 5);
      
      return {
        totalCandidates,
        activeCandidates,
        inactiveCandidates: totalCandidates - activeCandidates,
        totalVotations,
        activeVotations,
        completedVotations: totalVotations - activeVotations,
        totalVotes,
        topCandidates
      };
    } catch (error) {
      console.error('Error en getVoteStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};