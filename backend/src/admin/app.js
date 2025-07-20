const config = {
  // Configuración básica y segura
  locales: ['en'],
  
  // Personalización mínima del tema
  theme: {
    light: {
      colors: {
        primary500: '#ff01a1',
        primary600: '#e6017a',
        primary700: '#cc0169',
      },
    },
  },
  
  // Configuraciones básicas
  notifications: {
    releases: false,
  },
  
  tutorials: false,
};

const bootstrap = (app) => {
  console.log('FlorkafFun Admin Area loading...');
  
  // Cambiar el título de la página de forma segura
  if (typeof document !== 'undefined') {
    document.title = 'FlorkafFun Admin Area';
  }
};

export default {
  config,
  bootstrap,
};