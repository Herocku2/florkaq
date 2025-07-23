import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class NextTokenService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 45000; // 45 segundos para próximos tokens
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

  // Obtener proyectos próximos para la página NEXT
  async getNextProjects(page = 1, pageSize = 3, featured = false) {
    const cacheKey = `next-projects-${page}-${pageSize}-${featured}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const params = {
          page,
          pageSize
        };
        
        if (featured) {
          params.featured = 'true';
        }
        
        const response = await apiService.get('next/projects', params);
        return response;
      }, this.getFallbackNextProjects(page, pageSize), 'NextTokenService.getNextProjects');
    });
  }

  // Obtener calendario de lanzamientos
  async getNextSchedule() {
    const cacheKey = 'next-schedule';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('next/schedule');
        return response;
      }, this.getFallbackNextSchedule(), 'NextTokenService.getNextSchedule');
    });
  }

  // Obtener proyecto específico por ID
  async getNextProjectById(id) {
    const cacheKey = `next-project-${id}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`next/project/${id}`);
        return response;
      }, this.getFallbackNextProject(id), 'NextTokenService.getNextProjectById');
    });
  }

  // Crear recordatorio para proyecto
  async createReminder(projectId) {
    return await errorHandler.safeAsync(async () => {
      const response = await apiService.post(`next/project/${projectId}/reminder`);
      return response;
    }, { success: false, error: 'Error al crear recordatorio' }, 'NextTokenService.createReminder');
  }

  // Obtener Top 3 proyectos destacados
  async getTop3NextProjects() {
    return await this.getNextProjects(1, 3, true);
  }

  // Datos de fallback para proyectos próximos
  getFallbackNextProjects(page = 1, pageSize = 3) {
    return {
      data: [
        {
          id: 1,
          attributes: {
            nombre: "MAGA Token",
            simbolo: "MAGA",
            descripcion: "Token inspirado en el movimiento político americano",
            precioEstimado: 0.001,
            marketCapEstimado: 1000000,
            fechaLanzamiento: new Date(Date.now() + 86400000 * 2).toISOString(),
            estado: "proximo",
            destacado: true,
            progreso: 85,
            orden: 1,
            enlaces: {
              web: "https://magatoken.com",
              telegram: "https://t.me/magatoken",
              twitter: "https://twitter.com/magatoken",
              discord: "https://discord.gg/magatoken"
            },
            imagen: {
              data: {
                attributes: {
                  url: "/img/next-1.png",
                  alternativeText: "MAGA Token"
                }
              }
            }
          }
        },
        {
          id: 2,
          attributes: {
            nombre: "Pepe Classic",
            simbolo: "PEPEC",
            descripcion: "El regreso del meme más icónico de internet",
            precioEstimado: 0.0005,
            marketCapEstimado: 500000,
            fechaLanzamiento: new Date(Date.now() + 86400000 * 5).toISOString(),
            estado: "proximo",
            destacado: true,
            progreso: 92,
            orden: 2,
            enlaces: {
              web: "https://pepeclassic.io",
              telegram: "https://t.me/pepeclassic",
              twitter: "https://twitter.com/pepeclassic"
            },
            imagen: {
              data: {
                attributes: {
                  url: "/img/next-2.png",
                  alternativeText: "Pepe Classic"
                }
              }
            }
          }
        },
        {
          id: 3,
          attributes: {
            nombre: "Doge Revolution",
            simbolo: "DOGREV",
            descripcion: "La nueva era del token Doge en Solana",
            precioEstimado: 0.002,
            marketCapEstimado: 2000000,
            fechaLanzamiento: new Date(Date.now() + 86400000 * 7).toISOString(),
            estado: "proximo",
            destacado: true,
            progreso: 78,
            orden: 3,
            enlaces: {
              web: "https://dogerevolution.sol",
              telegram: "https://t.me/dogerevolution",
              twitter: "https://twitter.com/dogerevolution",
              discord: "https://discord.gg/dogerevolution"
            },
            imagen: {
              data: {
                attributes: {
                  url: "/img/next-3.png",
                  alternativeText: "Doge Revolution"
                }
              }
            }
          }
        }
      ],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 1,
          total: 3
        }
      }
    };
  }

  // Datos de fallback para calendario
  getFallbackNextSchedule() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            nombre: "MAGA Token",
            simbolo: "MAGA",
            fechaLanzamiento: new Date(Date.now() + 86400000 * 2).toISOString(),
            estado: "proximo"
          }
        },
        {
          id: 2,
          attributes: {
            nombre: "Pepe Classic",
            simbolo: "PEPEC",
            fechaLanzamiento: new Date(Date.now() + 86400000 * 5).toISOString(),
            estado: "proximo"
          }
        },
        {
          id: 3,
          attributes: {
            nombre: "Doge Revolution",
            simbolo: "DOGREV",
            fechaLanzamiento: new Date(Date.now() + 86400000 * 7).toISOString(),
            estado: "proximo"
          }
        }
      ]
    };
  }

  // Datos de fallback para proyecto específico
  getFallbackNextProject(id) {
    return {
      id: parseInt(id),
      attributes: {
        nombre: "Proyecto de Ejemplo",
        simbolo: "EXAMPLE",
        descripcion: "Este es un proyecto de ejemplo mientras se configura la base de datos",
        precioEstimado: 0.001,
        marketCapEstimado: 1000000,
        fechaLanzamiento: new Date(Date.now() + 86400000 * 3).toISOString(),
        estado: "proximo",
        destacado: false,
        progreso: 50,
        enlaces: {
          web: "https://example.com",
          telegram: "https://t.me/example"
        },
        imagen: {
          data: {
            attributes: {
              url: "/img/next-default.png",
              alternativeText: "Proyecto de ejemplo"
            }
          }
        }
      }
    };
  }

  // Transformar datos de proyecto para el frontend
  transformNextProjectData(strapiProject) {
    if (!strapiProject) return null;

    const attributes = strapiProject.attributes || strapiProject;
    
    return {
      id: strapiProject.id,
      nombre: attributes.nombre,
      simbolo: attributes.simbolo,
      descripcion: attributes.descripcion,
      precioEstimado: attributes.precioEstimado,
      marketCapEstimado: attributes.marketCapEstimado,
      fechaLanzamiento: attributes.fechaLanzamiento,
      estado: attributes.estado,
      destacado: attributes.destacado,
      progreso: attributes.progreso || 0,
      orden: attributes.orden || 0,
      enlaces: attributes.enlaces || {},
      imagen: attributes.imagen,
      // Campos calculados
      diasRestantes: this.calculateDaysRemaining(attributes.fechaLanzamiento),
      countdownText: this.getCountdownText(attributes.fechaLanzamiento),
      isLaunchingSoon: this.isLaunchingSoon(attributes.fechaLanzamiento)
    };
  }

  // Calcular días restantes para el lanzamiento
  calculateDaysRemaining(launchDate) {
    const now = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // Obtener texto de countdown
  getCountdownText(launchDate) {
    const daysRemaining = this.calculateDaysRemaining(launchDate);
    
    if (daysRemaining === 0) {
      return 'Lanza hoy';
    } else if (daysRemaining === 1) {
      return 'Lanza mañana';
    } else if (daysRemaining <= 7) {
      return `Lanza en ${daysRemaining} días`;
    } else {
      const launch = new Date(launchDate);
      return `Lanza el ${launch.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      })}`;
    }
  }

  // Verificar si el lanzamiento es pronto (menos de 3 días)
  isLaunchingSoon(launchDate) {
    return this.calculateDaysRemaining(launchDate) <= 3;
  }

  // Formatear precio estimado
  formatPrice(price) {
    if (price < 0.001) {
      return `$${(price * 1000).toFixed(3)}k`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  }

  // Formatear market cap estimado
  formatMarketCap(marketCap) {
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(0)}K`;
    } else {
      return `$${marketCap}`;
    }
  }
}

const nextTokenService = new NextTokenService();
export default nextTokenService;