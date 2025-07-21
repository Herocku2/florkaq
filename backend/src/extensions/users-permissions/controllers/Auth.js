'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';

module.exports = {
  // Registro personalizado
  async customRegister(ctx) {
    try {
      const { username, email, password } = ctx.request.body;

      console.log('📝 Registro personalizado:', { username, email });

      // Validaciones
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

      // Verificar usuario existente
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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Obtener rol authenticated
      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
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
          role: authenticatedRole.id,
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

      // Respuesta sin password
      const { password: _, ...userResponse } = newUser;

      console.log('✅ Usuario registrado:', newUser.id);

      ctx.send({
        success: true,
        jwt: token,
        user: userResponse,
        message: 'Usuario registrado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      ctx.send({
        success: false,
        error: 'Error interno: ' + error.message
      });
    }
  },

  // Login personalizado
  async customLogin(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      console.log('🔑 Login personalizado:', { identifier });

      if (!identifier || !password) {
        return ctx.send({
          success: false,
          error: 'Email/usuario y contraseña requeridos'
        });
      }

      // Buscar usuario
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

      if (user.blocked) {
        return ctx.send({
          success: false,
          error: 'Usuario bloqueado'
        });
      }

      // Verificar password
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
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

      // Respuesta sin password
      const { password: _, ...userResponse } = user;

      console.log('✅ Login exitoso:', user.id);

      ctx.send({
        success: true,
        jwt: token,
        user: userResponse,
        message: 'Login exitoso'
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      ctx.send({
        success: false,
        error: 'Error interno: ' + error.message
      });
    }
  }
};