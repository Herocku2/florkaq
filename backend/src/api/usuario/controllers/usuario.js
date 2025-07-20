'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';

module.exports = {
  // Registro de usuario
  async register(ctx) {
    try {
      const { username, email, password } = ctx.request.body;

      console.log('📝 Intento de registro:', { username, email });

      // Validaciones básicas
      if (!username || !email || !password) {
        return ctx.send({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      if (password.length < 6) {
        return ctx.send({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
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
        return ctx.send({
          success: false,
          error: 'El usuario o email ya existe'
        });
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

      console.log('✅ Usuario registrado exitosamente:', newUser.id);

      ctx.send({
        success: true,
        jwt: token,
        user: userWithoutPassword,
        message: 'Usuario registrado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      ctx.send({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // Login de usuario
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      console.log('🔑 Intento de login:', { identifier });

      // Validaciones básicas
      if (!identifier || !password) {
        return ctx.send({
          success: false,
          error: 'Email/usuario y contraseña son requeridos'
        });
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
        return ctx.send({
          success: false,
          error: 'Credenciales incorrectas'
        });
      }

      // Verificar si el usuario está bloqueado
      if (user.blocked) {
        return ctx.send({
          success: false,
          error: 'Usuario bloqueado'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
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

      ctx.send({
        success: true,
        jwt: token,
        user: userWithoutPassword,
        message: 'Login exitoso'
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      ctx.send({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};