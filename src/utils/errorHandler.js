// Error Handler centralizado para FlorkaFun
import { logger } from './logger';
import { isDevelopment } from '../config/environment';

class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandlers();
  }

  // Configurar manejadores globales de errores
  setupGlobalErrorHandlers() {
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Error');
    });

    // Manejar promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
      event.preventDefault(); // Prevenir que aparezca en la consola
    });
  }

  // Manejar errores de manera centralizada
  handleError(error, context = 'Unknown') {
    const errorInfo = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log del error
    if (isDevelopment()) {
      logger.error(`[${context}] ${errorInfo.message}`, errorInfo);
    } else {
      // En producción, log simplificado
      console.error(`Error: ${errorInfo.message}`);
    }

    // Aquí podrías enviar el error a un servicio de monitoreo
    // this.sendToMonitoringService(errorInfo);

    return errorInfo;
  }

  // Wrapper para funciones async que pueden fallar
  async safeAsync(asyncFn, fallback = null, context = 'Async Operation') {
    try {
      return await asyncFn();
    } catch (error) {
      this.handleError(error, context);
      return fallback;
    }
  }

  // Wrapper para operaciones síncronas que pueden fallar
  safe(fn, fallback = null, context = 'Sync Operation') {
    try {
      return fn();
    } catch (error) {
      this.handleError(error, context);
      return fallback;
    }
  }

  // Manejar errores de API específicamente
  handleApiError(error, endpoint = 'Unknown') {
    const apiError = {
      endpoint,
      status: error?.status || 'Unknown',
      message: error?.message || 'API Error',
      timestamp: new Date().toISOString()
    };

    logger.error(`API Error [${endpoint}]`, apiError);
    
    // Retornar un error estructurado
    return {
      success: false,
      error: apiError.message,
      status: apiError.status,
      endpoint: apiError.endpoint
    };
  }

  // Manejar errores de componentes React
  handleComponentError(error, errorInfo, componentName = 'Unknown Component') {
    const componentError = {
      component: componentName,
      error: error?.message || 'Component Error',
      stack: error?.stack || 'No stack trace',
      componentStack: errorInfo?.componentStack || 'No component stack',
      timestamp: new Date().toISOString()
    };

    logger.error(`Component Error [${componentName}]`, componentError);
    
    return componentError;
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;