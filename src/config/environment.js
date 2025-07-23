// Environment configuration for FlorkaFun

export const getApiBaseUrl = () => {
  return 'http://localhost:1337/api';
};

export const getEnvironment = () => {
  return 'development';
};

export const isDevelopment = () => {
  return getEnvironment() === 'development';
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};