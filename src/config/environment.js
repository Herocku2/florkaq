// Environment configuration for FlorkaFun

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
};

export const getEnvironment = () => {
  return import.meta.env.NODE_ENV || 'development';
};

export const isDevelopment = () => {
  return getEnvironment() === 'development';
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};

export const isLoggingEnabled = () => {
  return isDevelopment() || import.meta.env.VITE_ENABLE_LOGGING === 'true';
};