const setupModerator = async () => {
  try {
    console.log('🔧 Configurando usuario moderador...');

    // Buscar el usuario por email
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: 'giovanoti2@gmail.com' }
    });

    if (!user) {
      console.log('👤 Usuario no encontrado, creando usuario moderador...');
      
      // Crear usuario moderador si no existe
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('moderator123', 12);
      
      // Obtener rol authenticated
      const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      const newUser = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: 'giovanoti2',
          email: 'giovanoti2@gmail.com',
          password: hashedPassword,
          confirmed: true,
          blocked: false,
          role: authenticatedRole.id,
        }
      });

      console.log('✅ Usuario moderador creado:', newUser.email);
    } else {
      console.log('✅ Usuario moderador encontrado:', user.email);
    }

    // Crear o actualizar entrada en la colección usuarios con rol moderador
    const existingUsuario = await strapi.db.query('api::usuario.usuario').findOne({
      where: { email: 'giovanoti2@gmail.com' }
    });

    if (!existingUsuario) {
      await strapi.db.query('api::usuario.usuario').create({
        data: {
          nombre: 'Giovanni Moderador',
          email: 'giovanoti2@gmail.com',
          rol: 'moderador',
          activo: true,
          fecha_registro: new Date()
        }
      });
      console.log('✅ Rol de moderador asignado en la colección usuarios');
    } else {
      await strapi.db.query('api::usuario.usuario').update({
        where: { id: existingUsuario.id },
        data: { rol: 'moderador' }
      });
      console.log('✅ Rol de moderador actualizado');
    }

    console.log('🎉 Configuración de moderador completada!');

  } catch (error) {
    console.error('❌ Error configurando moderador:', error);
  }
};

module.exports = setupModerator;