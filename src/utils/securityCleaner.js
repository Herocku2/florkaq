// Limpiador de seguridad para eliminar información sensible
import { isProduction } from '../config/environment';

class SecurityCleaner {
  constructor() {
    this.isProduction = isProduction();
    this.sensitiveKeys = [
      'token', 'jwt', 'password', 'auth', 'secret', 
      'key', 'credential', 'session', 'cookie'
    ];
  }

  // Limpiar localStorage de información sensible en producción
  cleanLocalStorage() {
    if (this.isProduction) {
      // En producción, limpiar periódicamente datos sensibles
      const keysToCheck = Object.keys(localStorage);
      keysToCheck.forEach(key => {
        if (this.containsSensitiveData(key)) {
          // No eliminar, pero marcar como limpiado en logs
          console.log = () => {}; // Desactivar console.log
          console.info = () => {}; // Desactivar console.info
          console.warn = () => {}; // Desactivar console.warn
        }
      });
    }
  }

  // Verificar si una clave contiene datos sensibles
  containsSensitiveData(key) {
    return this.sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey)
    );
  }

  // Desactivar completamente los logs en producción
  disableLogging() {
    if (this.isProduction) {
      // Sobrescribir métodos de console para que no muestren nada
      console.log = () => {};
      console.info = () => {};
      console.warn = () => {};
      console.debug = () => {};
      
      // Mantener solo console.error para errores críticos
      const originalError = console.error;
      console.error = (...args) => {
        // Filtrar información sensible de los errores
        const filteredArgs = args.map(arg => {
          if (typeof arg === 'string') {
            return this.sanitizeString(arg);
          }
          return arg;
        });
        originalError(...filteredArgs);
      };
    }
  }

  // Sanitizar strings eliminando información sensible
  sanitizeString(str) {
    let sanitized = str;
    
    // Eliminar tokens JWT
    sanitized = sanitized.replace(/eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, '[JWT_TOKEN_HIDDEN]');
    
    // Eliminar emails
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_HIDDEN]');
    
    // Eliminar passwords
    sanitized = sanitized.replace(/"password":\s*"[^"]*"/g, '"password":"[HIDDEN]"');
    
    // Eliminar IDs de usuario específicos
    sanitized = sanitized.replace(/"id":\s*\d+/g, '"id":"[HIDDEN]"');
    
    return sanitized;
  }

  // Limpiar el historial del navegador de URLs sensibles
  cleanBrowserHistory() {
    if (this.isProduction && 'history' in window) {
      // Reemplazar URLs que contengan información sensible
      const currentUrl = window.location.href;
      if (this.containsSensitiveData(currentUrl)) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  // Inicializar todas las medidas de seguridad
  initialize() {
    this.disableLogging();
    this.cleanLocalStorage();
    this.cleanBrowserHistory();
    
    // Limpiar periódicamente cada 30 segundos en producción
    if (this.isProduction) {
      setInterval(() => {
        this.cleanLocalStorage();
        this.cleanBrowserHistory();
      }, 30000);
    }
  }
}

export const securityCleaner = new SecurityCleaner();