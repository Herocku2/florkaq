module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Personalización del admin panel
  options: {
    build: {
      backend: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'),
    },
  },
  // Configuración personalizada
  config: {
    // Cambiar el título del admin panel
    head: {
      favicon: env('FAVICON_URL', '/favicon.ico'),
    },
    // Personalizar el nombre de la aplicación
    locales: ['en', 'es'],
    // Configuraciones adicionales
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  // Personalización del branding
  branding: {
    title: 'FlorkafFun Admin Area',
    logo: {
      light: env('ADMIN_LOGO_LIGHT'),
      dark: env('ADMIN_LOGO_DARK'),
    },
    favicon: env('ADMIN_FAVICON'),
  },
});