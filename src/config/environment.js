// Configuración de entorno segura
const config = {
  // Detectar si estamos en desarrollo o producción
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // URLs de API (usar variables de entorno en producción)
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:1337/api',
    timeout: 10000, // 10 segundos
  },
  
  // Configuración de logging
  logging: {
    enabled: import.meta.env.MODE === 'development',
    level: import.meta.env.VITE_LOG_LEVEL || 'info', // info, warn, error
    sensitiveDataMask: '***HIDDEN***'
  },
  
  // Configuración de seguridad
  security: {
    // No mostrar información sensible en producción
    hideTokensInLogs: import.meta.env.MODE === 'production',
    hideUserDataInLogs: import.meta.env.MODE === 'production',
    hideApiResponsesInLogs: import.meta.env.MODE === 'production',
    
    // Headers de seguridad
    corsEnabled: true,
    csrfProtection: import.meta.env.MODE === 'production',
  },
  
  // Configuración de la aplicación
  app: {
    name: 'FlorkaFun',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  }
};

// Función para obtener configuración de forma segura
export const getConfig = () => {
  // En producción, no exponer configuración completa
  if (config.isProduction) {
    return {
      api: {
        baseUrl: config.api.baseUrl,
        timeout: config.api.timeout
      },
      app: {
        name: config.app.name,
        version: config.app.version
      }
    };
  }
  
  return config;
};

// Función para verificar si los logs están habilitados
export const isLoggingEnabled = () => config.logging.enabled;

// Función para obtener la URL base de la API de forma segura
export const getApiBaseUrl = () => config.api.baseUrl;

// Función para verificar si estamos en desarrollo
export const isDevelopment = () => config.isDevelopment;

// Función para verificar si estamos en producción
export const isProduction = () => config.isProduction;

export default config;