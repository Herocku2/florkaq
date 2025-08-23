module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      header: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      expose: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 31536000,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept']
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Middleware personalizado para bypass de autenticación
  {
    name: 'global::auth-bypass',
    config: {},
  },
];