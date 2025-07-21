// Sistema de logging seguro para producción
import { isLoggingEnabled, isProduction } from '../config/environment';

class SecureLogger {
  constructor() {
    this.loggingEnabled = isLoggingEnabled();
    this.isProduction = isProduction();
  }

  // Solo mostrar logs en desarrollo
  info(message, data = null) {
    if (this.loggingEnabled) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  }

  success(message, data = null) {
    if (this.loggingEnabled) {
      console.log(`✅ ${message}`, data || '');
    }
  }

  warning(message, data = null) {
    if (this.loggingEnabled) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  }

  error(message, error = null) {
    if (this.loggingEnabled) {
      console.error(`❌ ${message}`, error || '');
    } else if (this.isProduction) {
      // En producción, solo enviar errores críticos a un servicio de monitoreo
      // Sin exponer información sensible
      this.sendToMonitoring({
        level: 'error',
        message: message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  }

  // Función para enviar logs críticos a servicio de monitoreo (sin datos sensibles)
  sendToMonitoring(logData) {
    // En producción, esto enviaría logs a un servicio como Sentry, LogRocket, etc.
    // Por ahora, solo almacenar localmente sin información sensible
    try {
      const sanitizedLog = {
        ...logData,
        // Nunca incluir tokens, passwords, o datos personales
        sensitive_data_removed: true
      };
      
      // Almacenar en localStorage temporalmente (en producción sería un servicio externo)
      const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      existingLogs.push(sanitizedLog);
      
      // Mantener solo los últimos 50 logs
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(existingLogs));
    } catch (error) {
      // Fallar silenciosamente para no afectar la experiencia del usuario
    }
  }

  // Función para limpiar logs sensibles
  clearSensitiveLogs() {
    if (this.loggingEnabled) {
      console.clear();
    }
    localStorage.removeItem('app_logs');
  }
}

export const logger = new SecureLogger();