'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'florka-admin-jwt-secret-2024-secure-key';

// Advertencia de seguridad para JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  ADVERTENCIA: Se está usando JWT_SECRET por defecto. Configura JWT_SECRET en variables de entorno para mayor seguridad.');
}

module.exports = {
  // Registro de usuario
  async register(ctx) {
    try {
      const { username, email, password } = ctx.request.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        return ctx.badRequest('Todos los campos son requeridos');
      }

      if (password.length < 6) {
        return ctx.badRequest('La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el usuario ya existe
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
          ]
        }
      });

      if (existingUser) {
        return ctx.badRequest('El usuario o email ya existe');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Obtener rol por defecto (Authenticated)
      const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      // Crear usuario
      const newUser = await strapi.query('plugin::users-permissions.user').create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          confirmed: true,
          blocked: false,
          role: defaultRole.id,
        }
      });

      // Generar JWT
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email, 
          username: newUser.username 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remover password de la respuesta
      const { password: _, ...userWithoutPassword } = newUser;

      ctx.send({
        jwt: token,
        user: userWithoutPassword,
        message: 'Usuario registrado exitosamente'
      });

    } catch (error) {
      console.error('Error en registro:', error);
      ctx.badRequest('Error interno del servidor');
    }
  },

  // Login de usuario
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      // Validaciones básicas
      if (!identifier || !password) {
        return ctx.badRequest('Email/usuario y contraseña son requeridos');
      }

      // Buscar usuario por email o username
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: identifier.toLowerCase() },
            { username: identifier.toLowerCase() }
          ]
        }
      });

      if (!user) {
        return ctx.badRequest('Credenciales incorrectas');
      }

      // Verificar si el usuario está bloqueado
      if (user.blocked) {
        return ctx.badRequest('Usuario bloqueado');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ctx.badRequest('Credenciales incorrectas');
      }

      // Generar JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remover password de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      ctx.send({
        jwt: token,
        user: userWithoutPassword,
        message: 'Login exitoso'
      });

    } catch (error) {
      console.error('Error en login:', error);
      ctx.badRequest('Error interno del servidor');
    }
  },

  // Obtener información del usuario actual
  async me(ctx) {
    try {
      const token = ctx.request.header.authorization?.replace('Bearer ', '');

      if (!token) {
        return ctx.unauthorized('Token no proporcionado');
      }

      // Verificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);

      // Obtener usuario actualizado
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user || user.blocked) {
        return ctx.unauthorized('Usuario no válido');
      }

      // Remover password de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      ctx.send({
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      ctx.unauthorized('Token inválido');
    }
  },

  // Actualizar perfil
  async updateProfile(ctx) {
    try {
      const token = ctx.request.header.authorization?.replace('Bearer ', '');

      if (!token) {
        return ctx.unauthorized('Token no proporcionado');
      }

      // Verificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      const { username, email } = ctx.request.body;

      // Validaciones
      if (email) {
        const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
          where: { 
            email: email.toLowerCase(),
            id: { $ne: decoded.id }
          }
        });

        if (existingUser) {
          return ctx.badRequest('El email ya está en uso');
        }
      }

      if (username) {
        const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
          where: { 
            username: username.toLowerCase(),
            id: { $ne: decoded.id }
          }
        });

        if (existingUser) {
          return ctx.badRequest('El nombre de usuario ya está en uso');
        }
      }

      // Actualizar usuario
      const updatedUser = await strapi.query('plugin::users-permissions.user').update({
        where: { id: decoded.id },
        data: {
          ...(username && { username: username.toLowerCase() }),
          ...(email && { email: email.toLowerCase() }),
        }
      });

      // Remover password de la respuesta
      const { password: _, ...userWithoutPassword } = updatedUser;

      ctx.send({
        user: userWithoutPassword,
        message: 'Perfil actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      if (error.name === 'JsonWebTokenError') {
        return ctx.unauthorized('Token inválido');
      }
      ctx.badRequest('Error interno del servidor');
    }
  },

  // Cambiar contraseña
  async changePassword(ctx) {
    try {
      const token = ctx.request.header.authorization?.replace('Bearer ', '');

      if (!token) {
        return ctx.unauthorized('Token no proporcionado');
      }

      // Verificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      const { currentPassword, newPassword } = ctx.request.body;

      if (!currentPassword || !newPassword) {
        return ctx.badRequest('Contraseña actual y nueva son requeridas');
      }

      if (newPassword.length < 6) {
        return ctx.badRequest('La nueva contraseña debe tener al menos 6 caracteres');
      }

      // Obtener usuario
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user) {
        return ctx.unauthorized('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return ctx.badRequest('Contraseña actual incorrecta');
      }

      // Encriptar nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Actualizar contraseña
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: decoded.id },
        data: { password: hashedNewPassword }
      });

      ctx.send({
        message: 'Contraseña actualizada exitosamente'
      });

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      if (error.name === 'JsonWebTokenError') {
        return ctx.unauthorized('Token inválido');
      }
      ctx.badRequest('Error interno del servidor');
    }
  }
};