import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class PackageService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutos para paquetes (datos estáticos)
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

  // Obtener paquetes disponibles para creación de tokens
  async getPackages() {
    const cacheKey = 'creation-packages';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('Fetching packages from API...');
        const response = await apiService.get('create/packages');
        console.log('Packages response:', response);
        return response;
      }, this.getFallbackCreationPackages(), 'PackageService.getPackages');
    });
  }

  // Obtener plantillas de tokens
  async getTokenTemplates() {
    const cacheKey = 'token-templates';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('create/templates');
        return response;
      }, this.getFallbackTokenTemplates(), 'PackageService.getTokenTemplates');
    });
  }

  // Enviar solicitud de creación de token
  async submitTokenRequest(packageId, tokenData, paymentMethod, transactionHash) {
    // Limpiar cache de solicitudes después de enviar
    this.cache.delete('user-requests');
    
    return await errorHandler.safeAsync(async () => {
      const response = await apiService.post('create/submit', {
        data: {
          paqueteId: packageId,
          datosToken: tokenData,
          metodoPago: paymentMethod,
          transactionHash: transactionHash
        }
      });
      return response;
    }, { success: false, error: 'Error al enviar la solicitud' }, 'PackageService.submitTokenRequest');
  }

  // Obtener solicitudes del usuario
  async getUserRequests() {
    const cacheKey = 'user-requests';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('create/requests');
        return response;
      }, this.getFallbackUserRequests(), 'PackageService.getUserRequests');
    });
  }

  // Obtener estado de solicitud específica
  async getRequestStatus(requestId) {
    const cacheKey = `request-status-${requestId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`create/request/${requestId}/status`);
        return response;
      }, this.getFallbackRequestStatus(requestId), 'PackageService.getRequestStatus');
    });
  }

  // Datos de fallback para paquetes
  getFallbackCreationPackages() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            nombre: "Básico",
            precio: 50,
            nivel: "basico",
            descripcion: "Paquete básico para crear tu token meme",
            caracteristicas: [
              "Creación de token en Solana",
              "Metadatos básicos",
              "Imagen personalizada",
              "Soporte por email"
            ],
            beneficios: [
              "Token funcional",
              "Listado en la plataforma",
              "Acceso a foros"
            ],
            activo: true,
            popular: false,
            color: "#3b82f6",
            icon: "🚀"
          }
        },
        {
          id: 2,
          attributes: {
            nombre: "Profesional",
            precio: 1500,
            nivel: "profesional",
            descripcion: "Paquete profesional con marketing incluido",
            caracteristicas: [
              "Todo del paquete Básico",
              "Marketing en redes sociales",
              "Promoción destacada",
              "Análisis de mercado",
              "Soporte prioritario"
            ],
            beneficios: [
              "Mayor visibilidad",
              "Promoción en homepage",
              "Reportes de rendimiento",
              "Consultoría básica"
            ],
            activo: true,
            popular: true,
            color: "#10b981",
            icon: "⭐"
          }
        },
        {
          id: 3,
          attributes: {
            nombre: "Premium",
            precio: 3000,
            nivel: "premium",
            descripcion: "Paquete premium con servicios completos",
            caracteristicas: [
              "Todo del paquete Profesional",
              "Campaña de marketing completa",
              "Influencer partnerships",
              "Listado en exchanges",
              "Desarrollo de comunidad"
            ],
            beneficios: [
              "Máxima exposición",
              "Gestión de comunidad",
              "Partnerships estratégicos",
              "Soporte 24/7"
            ],
            activo: true,
            popular: false,
            color: "#8b5cf6",
            icon: "💎"
          }
        },
        {
          id: 4,
          attributes: {
            nombre: "Enterprise",
            precio: 5000,
            nivel: "enterprise",
            descripcion: "Paquete empresarial con servicios exclusivos",
            caracteristicas: [
              "Todo del paquete Premium",
              "Desarrollo personalizado",
              "Integración con DeFi",
              "Auditoría de seguridad",
              "Consultoría estratégica"
            ],
            beneficios: [
              "Solución completa",
              "Desarrollo a medida",
              "Máxima seguridad",
              "Consultoría experta"
            ],
            activo: true,
            popular: false,
            color: "#f59e0b",
            icon: "🏆"
          }
        }
      ]
    };
  }

  // Datos de fallback para plantillas
  getFallbackTokenTemplates() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            nombre: "Meme Clásico",
            descripcion: "Plantilla para tokens meme tradicionales",
            configuracion: {
              supply: 1000000000,
              decimals: 9,
              mintable: false,
              burnable: true
            },
            activa: true,
            orden: 1,
            icon: "😂"
          }
        },
        {
          id: 2,
          attributes: {
            nombre: "Token Comunitario",
            descripcion: "Plantilla para tokens de comunidad",
            configuracion: {
              supply: 100000000,
              decimals: 6,
              mintable: true,
              burnable: false
            },
            activa: true,
            orden: 2,
            icon: "👥"
          }
        },
        {
          id: 3,
          attributes: {
            nombre: "Token de Utilidad",
            descripcion: "Plantilla para tokens con utilidad específica",
            configuracion: {
              supply: 50000000,
              decimals: 8,
              mintable: true,
              burnable: true
            },
            activa: true,
            orden: 3,
            icon: "🔧"
          }
        }
      ]
    };
  }

  // Datos de fallback para solicitudes del usuario
  getFallbackUserRequests() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            estado: 'aprobado',
            fechaSolicitud: new Date(Date.now() - 86400000 * 3).toISOString(),
            datosToken: {
              nombre: "Mi Token",
              simbolo: "MTK",
              descripcion: "Mi primer token meme"
            },
            paquete: {
              data: {
                attributes: {
                  nombre: "Básico",
                  precio: 50
                }
              }
            }
          }
        }
      ]
    };
  }

  // Datos de fallback para estado de solicitud
  getFallbackRequestStatus(requestId) {
    return {
      id: parseInt(requestId),
      attributes: {
        estado: 'pendiente',
        fechaSolicitud: new Date().toISOString(),
        datosToken: {
          nombre: "Token de Ejemplo",
          simbolo: "EXAMPLE"
        }
      }
    };
  }

  // Transformar datos de paquete para el frontend
  transformPackageData(strapiPackage) {
    if (!strapiPackage) return null;

    const attributes = strapiPackage.attributes || strapiPackage;
    
    return {
      id: strapiPackage.id,
      nombre: attributes.nombre,
      precio: attributes.precio,
      nivel: attributes.nivel,
      descripcion: attributes.descripcion,
      caracteristicas: attributes.caracteristicas || [],
      beneficios: attributes.beneficios || [],
      activo: attributes.activo,
      popular: attributes.popular,
      color: attributes.color || '#3b82f6',
      icon: attributes.icon || '📦',
      // Campos calculados
      priceFormatted: this.formatPrice(attributes.precio),
      isPopular: attributes.popular === true,
      levelText: this.getLevelText(attributes.nivel),
      savings: this.calculateSavings(attributes.precio, attributes.nivel)
    };
  }

  // Transformar datos de plantilla para el frontend
  transformTemplateData(strapiTemplate) {
    if (!strapiTemplate) return null;

    const attributes = strapiTemplate.attributes || strapiTemplate;
    
    return {
      id: strapiTemplate.id,
      nombre: attributes.nombre,
      descripcion: attributes.descripcion,
      configuracion: attributes.configuracion || {},
      activa: attributes.activa,
      orden: attributes.orden || 0,
      icon: attributes.icon || '📄',
      // Campos calculados
      supplyFormatted: this.formatSupply(attributes.configuracion?.supply),
      features: this.getTemplateFeatures(attributes.configuracion)
    };
  }

  // Transformar datos de solicitud para el frontend
  transformRequestData(strapiRequest) {
    if (!strapiRequest) return null;

    const attributes = strapiRequest.attributes || strapiRequest;
    
    return {
      id: strapiRequest.id,
      estado: attributes.estado,
      fechaSolicitud: attributes.fechaSolicitud,
      datosToken: attributes.datosToken || {},
      paquete: attributes.paquete,
      // Campos calculados
      statusText: this.getStatusText(attributes.estado),
      statusColor: this.getStatusColor(attributes.estado),
      timeAgo: this.getTimeAgo(attributes.fechaSolicitud),
      canCancel: this.canCancelRequest(attributes.estado)
    };
  }

  // Formatear precio
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Formatear supply de tokens
  formatSupply(supply) {
    if (!supply) return '0';
    
    if (supply >= 1000000000) {
      return `${(supply / 1000000000).toFixed(1)}B`;
    } else if (supply >= 1000000) {
      return `${(supply / 1000000).toFixed(1)}M`;
    } else if (supply >= 1000) {
      return `${(supply / 1000).toFixed(1)}K`;
    }
    return supply.toString();
  }

  // Obtener texto del nivel
  getLevelText(level) {
    const levels = {
      basico: 'Básico',
      profesional: 'Profesional',
      premium: 'Premium',
      enterprise: 'Enterprise'
    };
    return levels[level] || level;
  }

  // Calcular ahorros (placeholder)
  calculateSavings(price, level) {
    const savings = {
      basico: 0,
      profesional: 10,
      premium: 20,
      enterprise: 30
    };
    return savings[level] || 0;
  }

  // Obtener características de plantilla
  getTemplateFeatures(config) {
    if (!config) return [];
    
    const features = [];
    if (config.mintable) features.push('Minteable');
    if (config.burnable) features.push('Quemable');
    if (config.decimals) features.push(`${config.decimals} decimales`);
    
    return features;
  }

  // Obtener texto del estado
  getStatusText(status) {
    const statusTexts = {
      pendiente: 'Pendiente',
      revision: 'En Revisión',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      completado: 'Completado'
    };
    return statusTexts[status] || status;
  }

  // Obtener color del estado
  getStatusColor(status) {
    const statusColors = {
      pendiente: '#f59e0b',
      revision: '#3b82f6',
      aprobado: '#10b981',
      rechazado: '#ef4444',
      completado: '#22c55e'
    };
    return statusColors[status] || '#6b7280';
  }

  // Obtener tiempo transcurrido
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  }

  // Verificar si se puede cancelar la solicitud
  canCancelRequest(status) {
    return ['pendiente', 'revision'].includes(status);
  }

  // Simular proceso de pago
  async simulatePayment(amount, method = 'crypto') {
    return await errorHandler.safeAsync(async () => {
      console.log('Simulating payment...', { amount, method });
      const response = await apiService.post('create/simulate-payment', {
        amount: amount,
        method: method
      });
      console.log('Payment simulation response:', response);
      return response;
    }, { success: false, error: 'Error en simulación de pago' }, 'PackageService.simulatePayment');
  }

  // Crear solicitud de token (método legacy para compatibilidad)
  async createTokenRequest(tokenRequestData) {
    return await this.submitTokenRequest(
      tokenRequestData.paquete,
      JSON.parse(tokenRequestData.datosToken),
      tokenRequestData.metodoPago || 'crypto',
      tokenRequestData.transaccionId
    );
  }
}

const packageService = new PackageService();
export default packageService;