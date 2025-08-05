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
            fechaLanzamiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
            fechaLanzamiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
            fechaLanzamiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            imagen: { data: { attributes: { url: "/img/image-3.png" } } },
            totalVotos: 28
          }
        }
      ],
      meta: { pagination: { page: page, pageSize: pageSize, pageCount: 1, total: 2 } }
    };
  }

  // Get top 3 tokens for ranking - HOME PAGE (Market Cap based)
  async getTop3Tokens() {
    const cacheKey = 'top3-tokens-home';

    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching rankings for HOME page (Market Cap based)...');

        // Intentar obtener ranking específico para home
        try {
          const response = await apiService.get('rankings/page/home');
          console.log('Home rankings response:', response);
          if (response?.data?.length > 0) {
            return response;
          }
        } catch (error) {
          console.log('No specific home rankings, using launched tokens...');
        }

        // Si no hay rankings específicos, usar tokens lanzados ordenados por market cap
        const launchedTokens = await this.getLaunchedTokens(1, 3);
        if (launchedTokens?.data?.length > 0) {
          // Convertir tokens a formato de ranking
          const rankingData = launchedTokens.data.map((token, index) => ({
            id: token.id,
            attributes: {
              posicion: index + 1,
              totalVotos: Math.floor(Math.random() * 50) + 10, // Simular votos
              fechaActualizacion: new Date().toISOString(),
              activo: true,
              pagina: "home",
              token: {
                data: token
              }
            }
          }));

          return { data: rankingData };
        }

        throw new Error('No data available');
      }, this.getFallbackTop3Tokens(), 'TokenService.getTop3Tokens');
    });
  }

  // Get top 3 tokens for ranking - NEXT PAGE (Votes based)
  async getTop3TokensNext() {
    const cacheKey = 'top3-tokens-next';

    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching rankings for NEXT page (Votes based)...');

        // Intentar obtener ranking específico para next
        try {
          const response = await apiService.get('rankings/page/next');
          console.log('Next rankings response:', response);
          if (response?.data?.length > 0) {
            return response;
          }
        } catch (error) {
          console.log('No specific next rankings, using next tokens...');
        }

        // Si no hay rankings específicos, usar próximos tokens ordenados por votos
        const nextTokens = await this.getNextTokens(1, 3, 'votes');
        if (nextTokens?.data?.length > 0) {
          // Convertir tokens a formato de ranking
          const rankingData = nextTokens.data.map((token, index) => ({
            id: token.id,
            attributes: {
              posicion: index + 1,
              totalVotos: token.attributes.totalVotos || Math.floor(Math.random() * 30) + 5,
              fechaActualizacion: new Date().toISOString(),
              activo: true,
              pagina: "next",
              token: {
                data: token
              }
            }
          }));

          return { data: rankingData };
        }

        throw new Error('No data available');
      }, this.getFallbackTop3TokensNext(), 'TokenService.getTop3TokensNext');
    });
  }

  // Datos de fallback para top 3 tokens - HOME (Market Cap based)
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
                  nombre: "CAT",
                  symbol: "CAT",
                  descripcion: "Top token by market cap",
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
                  nombre: "Shina inu",
                  symbol: "SBH",
                  descripcion: "Second by market cap",
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
                  nombre: "florka",
                  symbol: "FLK",
                  descripcion: "Third by market cap",
                  imagen: { data: { attributes: { url: "/img/image-1.png" } } }
                }
              }
            }
          }
        }
      ]
    };
  }

  // Datos de fallback para top 3 tokens - NEXT (Votes based)
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
                  nombre: "anto",
                  symbol: "ANT",
                  descripcion: "Most voted next token",
                  imagen: { data: { attributes: { url: "/img/image-3.png" } } }
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
                  nombre: "florkiño",
                  symbol: "FLK",
                  descripcion: "Second most voted",
                  imagen: { data: { attributes: { url: "/img/image-4.png" } } }
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
                  nombre: "nicolukas",
                  symbol: "NKL",
                  descripcion: "Third most voted",
                  imagen: { data: { attributes: { url: "/img/image-1.png" } } }
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
      symbol: attributes.symbol || attributes.nombre?.substring(0, 3).toUpperCase() || 'TKN',
      marketCap: Math.floor(Math.random() * 1000000) + 10000,
      progress: Math.floor(Math.random() * 100),
      holders: Math.floor(Math.random() * 10000) + 100,
      supply: Math.floor(Math.random() * 1000000000) + 1000000,
      // Datos adicionales para página de detalles
      precio: Math.random() * 1000 + 50,
      volumen24h: Math.floor(Math.random() * 100000) + 1000,
      swaps: Math.floor(Math.random() * 500) + 50,
      maxSupply: Math.floor(Math.random() * 10000) + 1000,
      tokensEnSwap: (Math.random() * 1000).toFixed(12),
      tokensConHolders: Math.floor(Math.random() * 5000) + 1000,
      solEnLiquidez: Math.floor(Math.random() * 100000) + 10000,
      tokenEnPoolSol: (Math.random() * 100).toFixed(3),
      warEnLiquidez: Math.floor(Math.random() * 100000) + 10000,
      tokenEnPoolWar: (Math.random() * 100).toFixed(3),
      bloqueados: (Math.random() * 1000).toFixed(9),
      valorBloqueados: Math.floor(Math.random() * 100000) + 10000,
      porcentajeBloqueados: (Math.random() * 10).toFixed(5) + '%',
      locked: Math.floor(Math.random() * 10000) + 1000,
      valorLocked: Math.floor(Math.random() * 2000000) + 100000,
      porcentajeLocked: (Math.random() * 80 + 10).toFixed(5) + '%',
      usuariosLocked: Math.floor(Math.random() * 2000) + 100,
      tvl: Math.floor(Math.random() * 10000) + 1000,
      vol24h: Math.floor(Math.random() * 1000) + 50,
      yield365d: '+' + (Math.random() * 20 + 1).toFixed(2) + '%'
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

  // Get token by name for detail page
  async getTokenByName(tokenName) {
    const cacheKey = `token-detail-${tokenName}`;

    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching token by name:', tokenName);

        // Buscar en tokens lanzados
        const tokensParams = {
          'filters[nombre][$containsi]': tokenName,
          'populate': 'imagen',
          'pagination[pageSize]': 1
        };

        const tokensResponse = await apiService.get('tokens', tokensParams);
        
        if (tokensResponse?.data?.length > 0) {
          return tokensResponse;
        }

        // Si no se encuentra en tokens, buscar en candidatos
        const candidatosParams = {
          'filters[nombre][$containsi]': tokenName,
          'populate': 'imagen',
          'pagination[pageSize]': 1
        };

        const candidatosResponse = await apiService.get('candidatos', candidatosParams);
        
        if (candidatosResponse?.data?.length > 0) {
          // Transformar candidato a formato de token
          const candidato = candidatosResponse.data[0];
          const tokenFromCandidato = {
            id: candidato.id,
            attributes: {
              ...candidato.attributes,
              estado: "lanzado",
              fechaLanzamiento: new Date().toISOString()
            }
          };

          return { data: [tokenFromCandidato] };
        }

        return { data: [] };
      }, this.getFallbackTokenByName(tokenName), 'TokenService.getTokenByName');
    });
  }

  // Fallback data for token detail
  getFallbackTokenByName(tokenName) {
    const fallbackTokens = {
      'bukele': {
        id: 1,
        attributes: {
          nombre: "Bukele",
          symbol: "BUK",
          descripcion: "Token del presidente de El Salvador, Nayib Bukele. Conocido por sus políticas innovadoras en Bitcoin y tecnología blockchain.",
          estado: "lanzado",
          fechaLanzamiento: new Date().toISOString(),
          imagen: { data: { attributes: { url: "/img/bukele.png" } } }
        }
      },
      'gustavo petro': {
        id: 2,
        attributes: {
          nombre: "Gustavo Petro",
          symbol: "GPT",
          descripcion: "Token del presidente colombiano Gustavo Petro. Enfocado en políticas progresistas y cambio social.",
          estado: "lanzado",
          fechaLanzamiento: new Date().toISOString(),
          imagen: { data: { attributes: { url: "/img/petro.png" } } }
        }
      },
      'barack obama': {
        id: 3,
        attributes: {
          nombre: "Barack Obama",
          symbol: "OBM",
          descripcion: "Token del 44º Presidente de Estados Unidos (2009-2017). Conocido por sus políticas progresistas y liderazgo inspirador.",
          estado: "lanzado",
          fechaLanzamiento: new Date().toISOString(),
          imagen: { data: { attributes: { url: "/img/obama.png" } } }
        }
      }
    };

    const normalizedName = tokenName.toLowerCase();
    const token = fallbackTokens[normalizedName] || {
      id: 999,
      attributes: {
        nombre: tokenName,
        symbol: tokenName.substring(0, 3).toUpperCase(),
        descripcion: `${tokenName} es un token innovador en el ecosistema de criptomonedas.`,
        estado: "lanzado",
        fechaLanzamiento: new Date().toISOString(),
        imagen: { data: { attributes: { url: "/img/image-4.png" } } }
      }
    };

    return { data: [token] };
  }

  // Transform ranking data
  transformRankingData(strapiRanking) {
    if (!strapiRanking) return null;

    const attributes = strapiRanking.attributes || strapiRanking;
    const tokenData = attributes.token?.data ? this.transformTokenData(attributes.token.data) : null;

    // Asegurar que el token tenga symbol
    if (tokenData && !tokenData.symbol) {
      tokenData.symbol = tokenData.nombre?.substring(0, 3).toUpperCase() || 'TKN';
    }

    return {
      id: strapiRanking.id,
      posicion: attributes.posicion,
      totalVotos: attributes.totalVotos,
      fechaActualizacion: attributes.fechaActualizacion,
      token: tokenData
    };
  }
}

const tokenService = new TokenService();
export default tokenService;