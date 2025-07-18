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
      
      const response = await apiService.get('/tokens', params);
      return response;
    } catch (error) {
      console.error('Error fetching launched tokens:', error);
      throw error;
    }
  }

  // Get top 3 tokens for ranking
  async getTop3Tokens() {
    try {
      const response = await apiService.get('/rankings', {
        'populate': 'token,token.imagen',
        'sort': 'posicion:asc',
        'filters[activo][$eq]': true
      });
      return response;
    } catch (error) {
      console.error('Error fetching top 3 tokens:', error);
      throw error;
    }
  }

  // Get token by ID
  async getTokenById(id) {
    try {
      const response = await apiService.get(`/tokens/${id}`, {
        'populate': 'imagen,votos'
      });
      return response;
    } catch (error) {
      console.error('Error fetching token by ID:', error);
      throw error;
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
      // Add calculated fields for NFT card display
      symbol: attributes.nombre?.substring(0, 3).toUpperCase() || 'TKN',
      marketCap: Math.floor(Math.random() * 1000000) + 10000, // Placeholder until Birdeye API
      progress: Math.floor(Math.random() * 100), // Placeholder
      holders: Math.floor(Math.random() * 10000) + 100, // Placeholder
      supply: Math.floor(Math.random() * 1000000000) + 1000000 // Placeholder
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