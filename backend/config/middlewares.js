module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      header: '*',
      origin: ['http://localhost:5200', 'http://localhost:5201', 'http://localhost:5202', 'http://localhost:3000', 'http://127.0.0.1:5200', 'http://127.0.0.1:5201', 'http://127.0.0.1:5202'],
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