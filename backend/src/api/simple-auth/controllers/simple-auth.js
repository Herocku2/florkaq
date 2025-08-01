'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';

module.exports = {
  // Registro simple sin verificación de permisos
  async register(ctx) {
    try {
      console.log('📝 Registro simple iniciado');
      const { username, email, password } = ctx.request.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      if (password.length < 6) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
          ]
        }
      });

      if (existingUser) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'El usuario o email ya existe'
        });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Obtener rol por defecto (Authenticated)
      const defaultRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      if (!defaultRole) {
        console.error('❌ No se encontró el rol authenticated');
        ctx.status = 500;
        return ctx.send({
          success: false,
          error: 'Error de configuración del sistema'
        });
      }

      // Crear usuario directamente en la base de datos
      const newUser = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          confirmed: true,
          blocked: false,
          role: defaultRole.id,
        }
      });

      // También crear en la tabla personalizada de usuarios
      await strapi.entityService.create('api::usuario.usuario', {
        data: {
          nombre: username,
          email: email.toLowerCase(),
          rol: 'usuario',
          activo: true,
          fechaRegistro: new Date()
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

      console.log('✅ Usuario registrado exitosamente:', newUser.id);

      ctx.status = 200;
      ctx.send({
        success: true,
        jwt: token,
        user: userWithoutPassword,
        message: 'Usuario registrado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error en registro simple:', error);
      ctx.status = 500;
      ctx.send({
        success: false,
        error: 'Error interno del servidor: ' + error.message
      });
    }
  },

  // Login simple sin verificación de permisos
  async login(ctx) {
    try {
      console.log('🔑 Login simple iniciado');
      const { identifier, password } = ctx.request.body;

      // Validaciones básicas
      if (!identifier || !password) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'Email/usuario y contraseña son requeridos'
        });
      }

      // Buscar usuario por email o username
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: identifier.toLowerCase() },
            { username: identifier.toLowerCase() }
          ]
        }
      });

      if (!user) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'Credenciales incorrectas'
        });
      }

      // Verificar si el usuario está bloqueado
      if (user.blocked) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'Usuario bloqueado'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        ctx.status = 400;
        return ctx.send({
          success: false,
          error: 'Credenciales incorrectas'
        });
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

      console.log('✅ Login exitoso:', user.id);

      ctx.status = 200;
      ctx.send({
        success: true,
        jwt: token,
        user: userWithoutPassword,
        message: 'Login exitoso'
      });

    } catch (error) {
      console.error('❌ Error en login simple:', error);
      ctx.status = 500;
      ctx.send({
        success: false,
        error: 'Error interno del servidor: ' + error.message
      });
    }
  },

  // Obtener información del usuario actual
  async me(ctx) {
    try {
      const token = ctx.request.header.authorization?.replace('Bearer ', '');

      if (!token) {
        ctx.status = 401;
        return ctx.send({
          success: false,
          error: 'Token no proporcionado'
        });
      }

      // Verificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);

      // Obtener usuario actualizado
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user || user.blocked) {
        ctx.status = 401;
        return ctx.send({
          success: false,
          error: 'Usuario no válido'
        });
      }

      // Remover password de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      ctx.status = 200;
      ctx.send({
        success: true,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      ctx.status = 401;
      ctx.send({
        success: false,
        error: 'Token inválido'
      });
    }
  }
};