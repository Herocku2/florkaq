import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class CandidateService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 segundos para candidatos (datos más dinámicos)
  }

  // Método para obtener datos del cache o hacer nueva petición
  async getCachedData(key, fetchFn) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      // Si hay error y tenemos cache, usar cache aunque esté expirado
      if (cached) {
        console.warn('Using expired cache due to API error');
        return cached.data;
      }
      throw error;
    }
  }

  // Obtener candidatos activos para votación
  async getVoteCandidates() {
    const cacheKey = 'vote-candidates';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('vote/candidates');
        return response;
      }, this.getFallbackVoteCandidates(), 'CandidateService.getVoteCandidates');
    });
  }

  // Emitir voto para un candidato
  async submitVote(candidateId, votingId) {
    // Limpiar cache después de votar
    this.cache.delete('vote-candidates');
    this.cache.delete(`vote-stats-${votingId}`);
    this.cache.delete(`user-vote-${votingId}`);
    
    return await errorHandler.safeAsync(async () => {
      const response = await apiService.post('vote/submit', {
        data: {
          candidateId,
          votingId
        }
      });
      return response;
    }, { success: false, error: 'Error al emitir el voto' }, 'CandidateService.submitVote');
  }

  // Verificar si el usuario ya votó
  async checkUserVote(votingId) {
    const cacheKey = `user-vote-${votingId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`vote/check/${votingId}`);
        return response;
      }, { hasVoted: false, vote: null }, 'CandidateService.checkUserVote');
    });
  }

  // Obtener estadísticas de votación en tiempo real
  async getVotingStats(votingId) {
    const cacheKey = `vote-stats-${votingId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`vote/stats/${votingId}`);
        return response;
      }, this.getFallbackVotingStats(), 'CandidateService.getVotingStats');
    });
  }

  // Datos de fallback para candidatos
  getFallbackVoteCandidates() {
    return {
      votacion: {
        id: 1,
        attributes: {
          titulo: "Votación Semanal de Tokens",
          descripcion: "Vota por tu token meme favorito para el próximo lanzamiento",
          fechaInicio: new Date(Date.now() - 86400000).toISOString(),
          fechaFin: new Date(Date.now() + 86400000 * 6).toISOString(),
          activa: true,
          candidatos: {
            data: [
              {
                id: 1,
                attributes: {
                  nombre: "Trump Coin",
                  simbolo: "TRUMP",
                  descripcion: "Token inspirado en el expresidente Donald Trump",
                  orden: 1,
                  imagen: {
                    data: {
                      attributes: {
                        url: "/img/vote-1.png",
                        alternativeText: "Trump Coin"
                      }
                    }
                  }
                },
                totalVotos: 45,
                porcentaje: "42.1"
              },
              {
                id: 2,
                attributes: {
                  nombre: "Elon Mars",
                  simbolo: "MARS",
                  descripcion: "Token dedicado a la misión de Elon Musk a Marte",
                  orden: 2,
                  imagen: {
                    data: {
                      attributes: {
                        url: "/img/vote-2.png",
                        alternativeText: "Elon Mars"
                      }
                    }
                  }
                },
                totalVotos: 38,
                porcentaje: "35.5"
              },
              {
                id: 3,
                attributes: {
                  nombre: "Shiba Moon",
                  simbolo: "SHIBM",
                  descripcion: "La evolución de Shiba Inu hacia la luna",
                  orden: 3,
                  imagen: {
                    data: {
                      attributes: {
                        url: "/img/vote-3.png",
                        alternativeText: "Shiba Moon"
                      }
                    }
                  }
                },
                totalVotos: 24,
                porcentaje: "22.4"
              }
            ]
          }
        }
      },
      totalVotos: 107
    };
  }

  // Datos de fallback para estadísticas
  getFallbackVotingStats() {
    return {
      totalVotes: 107,
      votesByCandidate: {
        1: 45,
        2: 38,
        3: 24
      },
      lastUpdate: new Date().toISOString()
    };
  }

  // Transformar datos de candidato para el frontend
  transformCandidateData(strapiCandidate) {
    if (!strapiCandidate) return null;

    const attributes = strapiCandidate.attributes || strapiCandidate;
    
    return {
      id: strapiCandidate.id,
      nombre: attributes.nombre,
      simbolo: attributes.simbolo,
      descripcion: attributes.descripcion,
      orden: attributes.orden || 0,
      imagen: attributes.imagen,
      totalVotos: strapiCandidate.totalVotos || 0,
      porcentaje: parseFloat(strapiCandidate.porcentaje || 0),
      // Campos calculados
      isLeading: this.isLeadingCandidate(strapiCandidate),
      votePercentageText: `${strapiCandidate.porcentaje || 0}%`,
      rankPosition: attributes.orden || 0
    };
  }

  // Transformar datos de votación para el frontend
  transformVotingData(strapiVoting) {
    if (!strapiVoting) return null;

    const attributes = strapiVoting.attributes || strapiVoting;
    
    return {
      id: strapiVoting.id,
      titulo: attributes.titulo,
      descripcion: attributes.descripcion,
      fechaInicio: attributes.fechaInicio,
      fechaFin: attributes.fechaFin,
      activa: attributes.activa,
      candidatos: attributes.candidatos?.data?.map(candidate => this.transformCandidateData(candidate)) || [],
      // Campos calculados
      timeRemaining: this.calculateTimeRemaining(attributes.fechaFin),
      isActive: this.isVotingActive(attributes.fechaInicio, attributes.fechaFin),
      daysRemaining: this.calculateDaysRemaining(attributes.fechaFin)
    };
  }

  // Verificar si un candidato está liderando
  isLeadingCandidate(candidate) {
    return parseFloat(candidate.porcentaje || 0) > 35; // Consideramos líder si tiene más del 35%
  }

  // Verificar si la votación está activa
  isVotingActive(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  }

  // Calcular tiempo restante para la votación
  calculateTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    
    if (diffTime <= 0) {
      return 'Votación finalizada';
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} restante${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} restante${diffMinutes > 1 ? 's' : ''}`;
    }
  }

  // Calcular días restantes
  calculateDaysRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // Obtener candidato ganador
  getLeadingCandidate(candidates) {
    if (!candidates || candidates.length === 0) return null;
    
    return candidates.reduce((leading, current) => {
      return (current.porcentaje > leading.porcentaje) ? current : leading;
    });
  }

  // Formatear número de votos
  formatVoteCount(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  // Obtener color para el porcentaje según la posición
  getPercentageColor(percentage) {
    if (percentage >= 40) return '#22c55e'; // Verde para líder
    if (percentage >= 25) return '#f59e0b'; // Amarillo para segundo
    return '#ef4444'; // Rojo para tercero
  }
}

const candidateService = new CandidateService();
export default candidateService;