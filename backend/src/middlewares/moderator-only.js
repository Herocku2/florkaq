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
      const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'florka-admin-jwt-secret-2024-secure-key';
      
      if (!JWT_SECRET || JWT_SECRET === 'florka-admin-jwt-secret-2024-secure-key') {
        console.warn('⚠️  ADVERTENCIA: Se está usando JWT_SECRET por defecto. Configura JWT_SECRET en variables de entorno.');
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar el usuario en la base de datos
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user || user.blocked) {
        return ctx.unauthorized('Usuario no válido');
      }

      // Verificar si es moderador (buscar en base de datos en lugar de hardcodear)
      const moderatorRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { name: 'Moderator' }
      });

      const isAdmin = user.role && (user.role.name === 'Administrator' || user.role.name === 'Moderator');
      const isModerator = moderatorRole && user.role && user.role.id === moderatorRole.id;

      if (!isAdmin && !isModerator) {
        return ctx.forbidden('Solo los administradores y moderadores pueden acceder al panel de administración');
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