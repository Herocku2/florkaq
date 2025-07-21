'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Rutas que deben ser públicas (sin autenticación)
    const publicRoutes = [
      '/api/usuario/register',
      '/api/usuario/login',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/custom-register',
      '/api/auth/custom-login',
      '/api/tokens',
      '/api/tokens/',
      '/api/votos',
      '/api/votos/',
      '/api/foros',
      '/api/foros/'
    ];

    // Si la ruta es pública, saltarse completamente la verificación de permisos
    if (publicRoutes.some(route => ctx.request.path.startsWith(route))) {
      console.log('🔓 Permitiendo acceso público a:', ctx.request.path);
      // Marcar como público para evitar verificaciones posteriores
      ctx.state.isPublic = true;
      return await next();
    }

    // Para otras rutas, continuar con el middleware normal
    await next();
  };
};