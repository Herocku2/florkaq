import apiService from './api.js';

class TokenService {
  // Get all launched tokens for home page
  async getLaunchedTokens(page = 1, pageSize = 10) {
    try {
      const params = {
        'filters[estado][$eq]': 'lanzado',
        'populate': 'imagen',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'sort': 'fechaLanzamiento:desc'
      };
      
      try {
        const response = await apiService.get('tokens', params);
        return response;
      } catch (apiError) {
        console.error('API error fetching launched tokens:', apiError);
        // Retornar datos de ejemplo si la API falla
        return {
          data: [
            { 
              id: 1, 
              attributes: { 
                nombre: "CAT", 
                descripcion: "Token de ejemplo",
                estado: "lanzado",
                fechaLanzamiento: new Date().toISOString(),
                imagen: { data: { attributes: { url: "/img/image-3.png" } } }
              } 
            },
            { 
              id: 2, 
              attributes: { 
                nombre: "Shina inu", 
                descripcion: "Token de ejemplo",
                estado: "lanzado",
                fechaLanzamiento: new Date().toISOString(),
                imagen: { data: { attributes: { url: "/img/image-4.png" } } }
              } 
            },
            { 
              id: 3, 
              attributes: { 
                nombre: "florka", 
                descripcion: "Token de ejemplo",
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
    } catch (error) {
      console.error('Error in getLaunchedTokens:', error);
      return {
        data: [],
        meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } }
      };
    }
  }
  
  // Get next tokens for next page
  async getNextTokens(page = 1, pageSize = 10, sortOrder = 'date') {
    try {
      const sortField = sortOrder === 'votes' ? 'totalVotos:desc' : 'fechaLanzamiento:asc';
      
      const params = {
        'filters[estado][$eq]': 'proximo',
        'populate': 'imagen',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'sort': sortField
      };
      
      try {
        const response = await apiService.get('tokens', params);
        return response;
      } catch (apiError) {
        console.error('API error fetching next tokens:', apiError);
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
            }
          ],
          meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } }
        };
      }
    } catch (error) {
      console.error('Error in getNextTokens:', error);
      return {
        data: [],
        meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } }
      };
    }
  }

  // Get top 3 tokens for ranking
  async getTop3Tokens() {
    try {
      try {
        const response = await apiService.get('rankings', {
          'populate': 'token,token.imagen',
          'sort': 'posicion:asc',
          'filters[activo][$eq]': true
        });
        return response;
      } catch (apiError) {
        console.error('API error fetching top 3 tokens:', apiError);
        // Retornar datos de ejemplo si la API falla
        return {
          data: [
            {
              id: 1,
              attributes: {
                posicion: 1,
                totalVotos: 28,
                fechaActualizacion: new Date().toISOString(),
                token: {
                  data: {
                    id: 5,
                    attributes: {
                      nombre: "anto",
                      descripcion: "Token más votado",
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
                totalVotos: 12,
                fechaActualizacion: new Date().toISOString(),
                token: {
                  data: {
                    id: 4,
                    attributes: {
                      nombre: "florkiño",
                      descripcion: "Token segundo más votado",
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
                totalVotos: 6,
                fechaActualizacion: new Date().toISOString(),
                token: {
                  data: {
                    id: 6,
                    attributes: {
                      nombre: "nicolukas",
                      descripcion: "Token tercer más votado",
                      imagen: { data: { attributes: { url: "/img/image-1.png" } } }
                    }
                  }
                }
              }
            }
          ]
        };
      }
    } catch (error) {
      console.error('Error in getTop3Tokens:', error);
      return { data: [] };
    }
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