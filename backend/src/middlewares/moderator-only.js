const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Solo aplicar a rutas del admin panel
    if (!ctx.request.path.startsWith('/admin')) {
      return await next();
    }

    try {
      // Obtener token de autorización
      const token = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return ctx.unauthorized('Token requerido para acceder al panel de administración');
      }

      // Verificar JWT
      const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar el usuario en la base de datos
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user || user.blocked) {
        return ctx.unauthorized('Usuario no válido');
      }

      // Verificar si es moderador
      const moderatorEmails = [
        'giovanoti2@gmail.com',
        'demo@florkafun.com'
      ];

      if (!moderatorEmails.includes(user.email)) {
        return ctx.forbidden('Solo los moderadores pueden acceder al panel de administración');
      }

      // Usuario es moderador, permitir acceso
      ctx.state.user = user;
      await next();

    } catch (error) {
      console.error('Error en middleware de moderador:', error);
      return ctx.unauthorized('Token inválido');
    }
  };
};