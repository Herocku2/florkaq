const config = {
  // Configuración básica y segura
  locales: ['en'],
  
  // Personalización del tema FlorkafFun
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
  
  // Personalización del branding
  auth: {
    logo: null, // Sin logo personalizado por ahora
  },
  
  menu: {
    logo: null, // Sin logo personalizado por ahora
  },
};

const bootstrap = (app) => {
  console.log('FlorkafFun Dashboard loading...');
  
  // Cambiar el título de la página de forma segura
  if (typeof document !== 'undefined') {
    document.title = 'FlorkafFun Dashboard';
    
    // Cambiar el título del dashboard en el DOM cuando esté disponible
    setTimeout(() => {
      const titleElement = document.querySelector('[data-testid="main-nav-brand-title"]');
      if (titleElement) {
        titleElement.textContent = 'FlorkafFun Dashboard';
      }
      
      // También cambiar otros elementos de título
      const navTitle = document.querySelector('.sc-ksBlkl');
      if (navTitle) {
        navTitle.textContent = 'FlorkafFun Dashboard';
      }
    }, 1000);
  }
};

export default {
  config,
  bootstrap,
};