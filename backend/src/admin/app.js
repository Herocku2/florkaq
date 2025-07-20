const config = {
  // Personalizar el título de la página
  head: {
    favicon: '/favicon.ico',
  },
  
  // Configuración de localización
  locales: ['en', 'es'],
  
  // Personalizar el tema y branding
  theme: {
    light: {
      colors: {
        primary100: '#f0f0ff',
        primary200: '#d9d8ff',
        primary500: '#7b79ff',
        primary600: '#6b69ff',
        primary700: '#5b59ff',
        danger700: '#b72b1a'
      },
    },
    dark: {
      colors: {
        primary100: '#181826',
        primary200: '#32324d',
        primary500: '#7b79ff',
        primary600: '#6b69ff', 
        primary700: '#5b59ff',
        danger700: '#ee5a52'
      },
    },
  },
  
  // Personalizar el logo y título
  config: {
    // Cambiar el título que aparece en el navegador
    head: {
      title: 'FlorkafFun Admin Area',
    },
    
    // Personalizar el logo del admin
    auth: {
      logo: '/admin/florka-logo.png', // Ruta al logo personalizado
    },
    
    // Personalizar el menú
    menu: {
      logo: '/admin/florka-logo.png',
    },
    
    // Configuraciones adicionales
    notifications: {
      releases: false,
    },
    
    tutorials: false,
  },
  
  // Función para personalizar el bootstrap de la aplicación
  bootstrap(app) {
    // Cambiar el título dinámicamente
    document.title = 'FlorkafFun Admin Area';
    
    // Personalizar el favicon
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/favicon.ico';
    document.head.appendChild(favicon);
    
    console.log('FlorkafFun Admin Area initialized');
  },
};

const bootstrap = (app) => {
  console.log('Bootstrapping FlorkafFun Admin Area...');
  
  // Cambiar el título de la página
  document.title = 'FlorkafFun Admin Area';
  
  // Personalizar meta tags
  const metaTitle = document.querySelector('meta[name="title"]') || document.createElement('meta');
  metaTitle.name = 'title';
  metaTitle.content = 'FlorkafFun Admin Area';
  document.head.appendChild(metaTitle);
  
  const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = 'FlorkafFun Token Platform Administration Panel';
  document.head.appendChild(metaDescription);
};

export default {
  config,
  bootstrap,
};