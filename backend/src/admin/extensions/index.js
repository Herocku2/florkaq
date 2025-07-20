module.exports = {
  // Personalizar la configuración del admin
  config: {
    // Cambiar el título de la aplicación
    head: {
      title: 'FlorkafFun Admin Area',
    },
    
    // Personalizar el branding
    auth: {
      logo: '/uploads/florka_logo_admin.png',
    },
    
    menu: {
      logo: '/uploads/florka_logo_admin.png',
    },
    
    // Personalizar colores del tema
    theme: {
      light: {
        colors: {
          primary100: '#f6ecfc',
          primary200: '#e0c1f4',
          primary500: '#ac73e6',
          primary600: '#9736e8',
          primary700: '#8312d1',
          danger700: '#b72b1a'
        },
      },
      dark: {
        colors: {
          primary100: '#181826',
          primary200: '#32324d', 
          primary500: '#ac73e6',
          primary600: '#9736e8',
          primary700: '#8312d1',
          danger700: '#ee5a52'
        },
      },
    },
    
    // Configuraciones adicionales
    notifications: {
      releases: false,
    },
    
    tutorials: false,
  },
  
  // Personalizar traducciones
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'FlorkafFun Admin',
      'app.components.LeftMenu.navbrand.workplace': 'Admin Area',
      'Auth.form.welcome.title': 'Welcome to FlorkafFun!',
      'Auth.form.welcome.subtitle': 'Log in to your FlorkafFun Admin Area',
      'HomePage.welcome': 'Welcome to FlorkafFun Admin Area!',
      'HomePage.welcome.again': 'Welcome back to FlorkafFun!',
      'Settings.application.title': 'FlorkafFun Settings',
      'global.content-manager': 'Content Manager',
      'content-manager.plugin.name': 'Content Manager',
    },
    es: {
      'app.components.LeftMenu.navbrand.title': 'FlorkafFun Admin',
      'app.components.LeftMenu.navbrand.workplace': 'Área de Administración',
      'Auth.form.welcome.title': '¡Bienvenido a FlorkafFun!',
      'Auth.form.welcome.subtitle': 'Inicia sesión en tu Área de Administración FlorkafFun',
      'HomePage.welcome': '¡Bienvenido al Área de Administración FlorkafFun!',
      'HomePage.welcome.again': '¡Bienvenido de nuevo a FlorkafFun!',
      'Settings.application.title': 'Configuración de FlorkafFun',
      'global.content-manager': 'Gestor de Contenido',
      'content-manager.plugin.name': 'Gestor de Contenido',
    }
  }
};