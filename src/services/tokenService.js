import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class TokenService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 segundos
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

  // Get all launched tokens for home page
  async getLaunchedTokens(page = 1, pageSize = 10) {
    const cacheKey = `launched-tokens-${page}-${pageSize}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Trying to get launched tokens from backend...');
        
        // Primero intentar obtener tokens reales
        const params = {
          'filters[estado][$eq]': 'lanzado',
          'populate': 'imagen',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort': 'fechaLanzamiento:desc'
        };
        
        const response = await apiService.get('tokens', params);
        console.log('Tokens response:', response);
        
        // Si no hay tokens, usar candidatos como tokens lanzados
        if (!response?.data || response.data.length === 0) {
          console.log('No tokens found, using candidatos as launched tokens...');
          return await this.getFallbackLaunchedTokens(page, pageSize);
        }
        
        return response;
      }, await this.getFallbackLaunchedTokens(page, pageSize), 'TokenService.getLaunchedTokens');
    });
  }

  // Obtener candidatos reales del backend para usar como tokens lanzados
  async getFallbackLaunchedTokens(page = 1, pageSize = 10) {
    try {
      console.log('Fetching candidatos for launched tokens...');
      // Intentar obtener candidatos reales del backend
      const candidatosResponse = await apiService.get('candidatos', {
        'populate': 'imagen',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      });
      
      console.log('Candidatos response for launched tokens:', candidatosResponse);
      
      if (candidatosResponse?.data?.length > 0) {
        // Transformar candidatos a formato de tokens
        const tokensFromCandidatos = candidatosResponse.data.map(candidato => ({
          id: candidato.id,
          attributes: {
            nombre: candidato.attributes.nombre,
            descripcion: candidato.attributes.descripcion,
            estado: "lanzado",
            fechaLanzamiento: new Date().toISOString(),
            imagen: candidato.attributes.imagen
          }
        }));
        
        console.log('Transformed tokens from candidatos:', tokensFromCandidatos);
        
        return {
          data: tokensFromCandidatos,
          meta: candidatosResponse.meta || {
            pagination: {
              page: page,
              pageSize: pageSize,
              pageCount: 1,
              total: tokensFromCandidatos.length
            }
          }
        };
      }
    } catch (error) {
      console.error('Error fetching candidatos for fallback:', error);
    }
    
    // Fallback estático si no se pueden obtener candidatos
    return {
      data: [
        { 
          id: 1, 
          attributes: { 
            nombre: "Bukele", 
            descripcion: "Token del presidente de El Salvador",
            estado: "lanzado",
            fechaLanzamiento: new Date().toISOString(),
            imagen: { data: { attributes: { url: "/img/image-3.png" } } }
          } 
        },
        { 
          id: 2, 
          attributes: { 
            nombre: "Gustavo Petro Token", 
            descripcion: "Token del presidente colombiano",
            estado: "lanzado",
            fechaLanzamiento: new Date().toISOString(),
            imagen: { data: { attributes: { url: "/img/image-4.png" } } }
          } 
        },
        { 
          id: 3, 
          attributes: { 
            nombre: "Barack Obama Coin", 
            descripcion: "Token del expresidente estadounidense",
            estado: "lanzado",
            fechaLanzamiento: new Date().toISOString(),
            imagen: { data: { attributes: { url: "/img/image-1.png" } } }
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
  
  // Get next tokens for next page
  async getNextTokens(page = 1, pageSize = 10, sortOrder = 'date') {
    const cacheKey = `next-tokens-${page}-${pageSize}-${sortOrder}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const sortField = sortOrder === 'votes' ? 'totalVotos:desc' : 'fechaLanzamiento:asc';
        
        const params = {
          'filters[estado][$eq]': 'proximo',
          'populate': 'imagen',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort': sortField
        };
        
        const response = await apiService.get('tokens', params);
        return response;
      }, await this.getFallbackNextTokens(page, pageSize), 'TokenService.getNextTokens');
    });
  }

  // Obtener candidatos reales del backend para usar como próximos tokens
  async getFallbackNextTokens(page = 1, pageSize = 10) {
    try {
      console.log('Fetching candidatos for next tokens...');
      // Intentar obtener candidatos reales del backend
      const candidatosResponse = await apiService.get('candidatos', {
        'populate': 'imagen',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize
      });
      
      console.log('Candidatos response for next tokens:', candidatosResponse);
      
      if (candidatosResponse?.data?.length > 0) {
        // Transformar candidatos a formato de próximos tokens
        const tokensFromCandidatos = candidatosResponse.data.map(candidato => ({
          id: candidato.id,
          attributes: {
            nombre: candidato.attributes.nombre,
            descripcion: candidato.attributes.descripcion,
            estado: "proximo",
            fechaLanzamiento: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
            imagen: candidato.attributes.imagen,
            totalVotos: candidato.attributes.votos || 0
          }
        }));
        
        console.log('Transformed next tokens from candidatos:', tokensFromCandidatos);
        
        return {
          data: tokensFromCandidatos,
          meta: candidatosResponse.meta || {
            pagination: {
              page: page,
              pageSize: pageSize,
              pageCount: 1,
              total: tokensFromCandidatos.length
            }
          }
        };
      }
    } catch (error) {
      console.error('Error fetching candidatos for next tokens fallback:', error);
    }
    
    // Fallback estático si no se pueden obtener candidatos
    return {
      data: [
        { 
          id: 4, 
          attributes: { 
            nombre: "florkiño", 
            descripcion: "Token próximo a lanzar",
            estado: "proximo",
            fechaLanzamiento: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
            imagen: { data: { attributes: { url: "/img/image-4.png" } } },
            totalVotos: 12
          } 
        },
        { 
          id: 5, 
          attributes: { 
            nombre: "anto", 
            descripcion: "Token próximo a lanzar",
            estado: "proximo",
            fechaLanzamiento: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
            imagen: { data: { attributes: { url: "/img/image-3.png" } } },
            totalVotos: 28
          } 
        }
      ],
      meta: { pagination: { page: page, pageSize: pageSize, pageCount: 1, total: 2 } }
    };
  }

  // Get top 3 tokens for ranking - HOME PAGE
  async getTop3Tokens() {
    const cacheKey = 'top3-tokens-home';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching rankings for HOME page...');
        const response = await apiService.get('rankings/page/home');
        console.log('Home rankings response:', response);
        return response;
      }, this.getFallbackTop3Tokens(), 'TokenService.getTop3Tokens');
    });
  }

  // Get top 3 tokens for ranking - NEXT PAGE
  async getTop3TokensNext() {
    const cacheKey = 'top3-tokens-next';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching rankings for NEXT page...');
        const response = await apiService.get('rankings/page/next');
        console.log('Next rankings response:', response);
        return response;
      }, this.getFallbackTop3TokensNext(), 'TokenService.getTop3TokensNext');
    });
  }

  // Datos de fallback para top 3 tokens - HOME
  getFallbackTop3Tokens() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            posicion: 1,
            totalVotos: 28,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "home",
            token: {
              data: {
                id: 1,
                attributes: {
                  nombre: "Bukele",
                  descripcion: "Token del presidente de El Salvador",
                  imagen: { data: { attributes: { url: "/img/image-3.png" } } }
                }
              }
            }
          }
        },
        {
          id: 2,
          attributes: {
            posicion: 2,
            totalVotos: 15,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "home",
            token: {
              data: {
                id: 2,
                attributes: {
                  nombre: "Gustavo Petro Token",
                  descripcion: "Token del presidente colombiano",
                  imagen: { data: { attributes: { url: "/img/image-4.png" } } }
                }
              }
            }
          }
        },
        {
          id: 3,
          attributes: {
            posicion: 3,
            totalVotos: 8,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "home",
            token: {
              data: {
                id: 3,
                attributes: {
                  nombre: "Barack Obama Coin",
                  descripcion: "Token del expresidente estadounidense",
                  imagen: { data: { attributes: { url: "/img/image-1.png" } } }
                }
              }
            }
          }
        }
      ]
    };
  }

  // Datos de fallback para top 3 tokens - NEXT
  getFallbackTop3TokensNext() {
    return {
      data: [
        {
          id: 4,
          attributes: {
            posicion: 1,
            totalVotos: 45,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "next",
            token: {
              data: {
                id: 4,
                attributes: {
                  nombre: "Next Token 1",
                  descripcion: "Próximo token más votado",
                  imagen: { data: { attributes: { url: "/img/image-1.png" } } }
                }
              }
            }
          }
        },
        {
          id: 5,
          attributes: {
            posicion: 2,
            totalVotos: 32,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "next",
            token: {
              data: {
                id: 5,
                attributes: {
                  nombre: "Next Token 2",
                  descripcion: "Segundo próximo token",
                  imagen: { data: { attributes: { url: "/img/image-3.png" } } }
                }
              }
            }
          }
        },
        {
          id: 6,
          attributes: {
            posicion: 3,
            totalVotos: 18,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            pagina: "next",
            token: {
              data: {
                id: 6,
                attributes: {
                  nombre: "Next Token 3",
                  descripcion: "Tercer próximo token",
                  imagen: { data: { attributes: { url: "/img/image-4.png" } } }
                }
              }
            }
          }
        }
      ]
    };
  }

  // Transform token data for frontend use
  transformTokenData(strapiToken) {
    if (!strapiToken) return null;

    const attributes = strapiToken.attributes || strapiToken;
    
    return {
      id: strapiToken.id,
      nombre: attributes.nombre,
      descripcion: attributes.descripcion,
      mintAddress: attributes.mintAddress,
      imagen: attributes.imagen,
      fechaLanzamiento: attributes.fechaLanzamiento,
      estado: attributes.estado,
      red: attributes.red,
      symbol: attributes.nombre?.substring(0, 3).toUpperCase() || 'TKN',
      marketCap: Math.floor(Math.random() * 1000000) + 10000,
      progress: Math.floor(Math.random() * 100),
      holders: Math.floor(Math.random() * 10000) + 100,
      supply: Math.floor(Math.random() * 1000000000) + 1000000
    };
  }

  // Get tokens in voting (from active votaciones)
  async getTokensInVoting(page = 1, pageSize = 10) {
    const cacheKey = `tokens-voting-${page}-${pageSize}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        // Primero intentar obtener candidatos activos directamente
        const candidatosParams = {
          'filters[activo][$eq]': true,
          'populate': 'imagen',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort': 'votos:desc'
        };
        
        const candidatosResponse = await apiService.get('candidatos', candidatosParams);
        
        if (candidatosResponse?.data?.length > 0) {
          return candidatosResponse;
        }
        
        // Si no hay candidatos directos, obtener desde votaciones activas
        const votacionesParams = {
          'filters[activa][$eq]': true,
          'populate': 'candidatos,candidatos.imagen',
          'pagination[page]': 1,
          'pagination[pageSize]': 1,
          'sort': 'fechaInicio:desc'
        };
        
        const votacionesResponse = await apiService.get('votaciones', votacionesParams);
        
        if (votacionesResponse?.data?.length > 0) {
          const votacionActiva = votacionesResponse.data[0];
          const candidatos = votacionActiva.attributes.candidatos?.data || [];
          
          console.log('Candidatos from votacion activa:', candidatos);
          
          // Paginar los candidatos
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedCandidatos = candidatos.slice(startIndex, endIndex);
          
          return {
            data: paginatedCandidatos,
            meta: {
              pagination: {
                page: page,
                pageSize: pageSize,
                pageCount: Math.ceil(candidatos.length / pageSize),
                total: candidatos.length
              }
            }
          };
        }
        
        return { data: [], meta: { pagination: { page: 1, pageSize: pageSize, pageCount: 0, total: 0 } } };
      }, this.getFallbackTokensInVoting(page, pageSize), 'TokenService.getTokensInVoting');
    });
  }

  // Sin datos de fallback - solo datos reales del backend
  getFallbackTokensInVoting(page = 1, pageSize = 10) {
    return {
      data: [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      }
    };
  }

  // Transform ranking data
  transformRankingData(strapiRanking) {
    if (!strapiRanking) return null;

    const attributes = strapiRanking.attributes || strapiRanking;
    const token = attributes.token?.data ? this.transformTokenData(attributes.token.data) : null;
    
    return {
      id: strapiRanking.id,
      posicion: attributes.posicion,
      totalVotos: attributes.totalVotos,
      fechaActualizacion: attributes.fechaActualizacion,
      token: token
    };
  }
}

const tokenService = new TokenService();
export default tokenService;