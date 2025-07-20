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
    logo: '/admin/florka-logo.svg',
  },
  
  menu: {
    logo: '/admin/florka-logo.svg',
  },
  
  // Traducciones directas en config
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'FlorkaFun Dashboard',
      'app.components.LeftMenu.navbrand.workplace': 'Admin Area',
    }
  },
};

const bootstrap = (app) => {
  console.log('FlorkaFun Dashboard loading...');
  
  // Cambiar el título de la página de forma segura
  if (typeof document !== 'undefined') {
    document.title = 'FlorkaFun Dashboard';
    
    // Cambiar el título del dashboard en el DOM cuando esté disponible
    setTimeout(() => {
      const titleElement = document.querySelector('[data-testid="main-nav-brand-title"]');
      if (titleElement) {
        titleElement.textContent = 'FlorkaFun Dashboard';
      }
      
      // También cambiar otros elementos de título
      const navTitle = document.querySelector('.sc-ksBlkl');
      if (navTitle) {
        navTitle.textContent = 'FlorkaFun Dashboard';
      }
    }, 1000);
  }
};

export default {
  config,
  bootstrap,
};