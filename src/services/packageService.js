import apiService from './api';

class PackageService {
  // Get all available packages
  async getPackages() {
    try {
      const response = await apiService.get('paquetes', {
        'populate': '*',
        'sort': 'precio:asc'
      });
      return response;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  // Get package by ID
  async getPackageById(id) {
    try {
      const response = await apiService.get(`paquetes/${id}`, {
        'populate': '*'
      });
      return response;
    } catch (error) {
      console.error('Error fetching package by ID:', error);
      throw error;
    }
  }

  // Create token request
  async createTokenRequest(requestData) {
    try {
      const response = await apiService.post('solicitudes-token', {
        data: requestData
      });
      return response;
    } catch (error) {
      console.error('Error creating token request:', error);
      throw error;
    }
  }

  // Get user token requests
  async getUserTokenRequests(userId) {
    try {
      const response = await apiService.get('solicitudes-token', {
        'filters[usuario][$eq]': userId,
        'populate': 'paquete',
        'sort': 'createdAt:desc'
      });
      return response;
    } catch (error) {
      console.error('Error fetching user token requests:', error);
      throw error;
    }
  }

  // Simulate payment process
  async simulatePayment(amount, currency = 'USDT') {
    try {
      // This is a simulation, in a real app this would connect to a payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      return {
        success: true,
        transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`,
        amount,
        currency,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Transform package data for frontend use
  transformPackageData(strapiPackage) {
    if (!strapiPackage) return null;

    const attributes = strapiPackage.attributes || strapiPackage;
    
    return {
      id: strapiPackage.id,
      nombre: attributes.nombre,
      precio: attributes.precio,
      nivel: attributes.nivel,
      caracteristicas: attributes.caracteristicas?.split('\n') || [],
      beneficios: attributes.beneficios?.split('\n') || [],
      imagen: attributes.imagen?.data?.attributes?.url || null
    };
  }
}

const packageService = new PackageService();
export default packageService;