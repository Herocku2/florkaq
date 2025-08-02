const strapi = require('@strapi/strapi');

async function setupModeratorRole() {
  try {
    console.log('🚀 Configurando rol de moderador en Strapi...');
    
    // Inicializar Strapi
    const app = await strapi().load();
    await app.start();
    
    // Buscar si ya existe el rol de moderador
    let moderatorRole = await app.query('plugin::users-permissions.role').findOne({
      where: { name: 'Moderator' }
    });
    
    if (!moderatorRole) {
      // Crear rol de moderador
      moderatorRole = await app.query('plugin::users-permissions.role').create({
        data: {
          name: 'Moderator',
          description: 'Rol para moderadores de foros',
          type: 'moderator'
        }
      });
      console.log('✅ Rol de moderador creado:', moderatorRole.id);
    } else {
      console.log('✅ Rol de moderador ya existe:', moderatorRole.id);
    }
    
    // Configurar permisos para el rol de moderador
    const permissions = [
      // Permisos para foros
      { action: 'plugin::content-manager.explorer.create', subject: 'api::foro.foro' },
      { action: 'plugin::content-manager.explorer.read', subject: 'api::foro.foro' },
      { action: 'plugin::content-manager.explorer.update', subject: 'api::foro.foro' },
      { action: 'plugin::content-manager.explorer.delete', subject: 'api::foro.foro' },
      
      // Permisos para comentarios
      { action: 'plugin::content-manager.explorer.read', subject: 'api::comentario.comentario' },
      { action: 'plugin::content-manager.explorer.delete', subject: 'api::comentario.comentario' },
      
      // Permisos básicos de acceso
      { action: 'admin::marketplace.read', subject: null },
      { action: 'admin::webhooks.read', subject: null },
      { action: 'plugin::content-manager.explorer.read', subject: null },
    ];
    
    // Eliminar permisos existentes del rol
    await app.query('admin::permission').deleteMany({
      where: { role: moderatorRole.id }
    });
    
    // Crear nuevos permisos
    for (const permission of permissions) {
      await app.query('admin::permission').create({
        data: {
          action: permission.action,
          subject: permission.subject,
          role: moderatorRole.id,
          conditions: []
        }
      });
    }
    
    console.log('✅ Permisos configurados para moderadores');
    
    // Crear usuario moderador de ejemplo
    const moderatorEmail = 'giovanoti3@gmail.com';
    
    // Buscar si el usuario ya existe
    let moderatorUser = await app.query('admin::user').findOne({
      where: { email: moderatorEmail }
    });
    
    if (!moderatorUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      moderatorUser = await app.query('admin::user').create({
        data: {
          firstname: 'Maximo',
          lastname: 'Moderador',
          username: 'maximo',
          email: moderatorEmail,
          password: hashedPassword,
          isActive: true,
          blocked: false,
          preferedLanguage: 'es'
        }
      });
      
      console.log('✅ Usuario moderador creado:', moderatorUser.id);
    } else {
      console.log('✅ Usuario moderador ya existe:', moderatorUser.id);
    }
    
    // Asignar rol al usuario
    await app.query('admin::user').update({
      where: { id: moderatorUser.id },
      data: {
        roles: [moderatorRole.id]
      }
    });
    
    console.log('✅ Rol asignado al usuario moderador');
    console.log('');
    console.log('🎉 CONFIGURACIÓN COMPLETADA:');
    console.log(`📧 Email: ${moderatorEmail}`);
    console.log(`🔑 Password: 123456`);
    console.log(`🌐 Panel: http://localhost:1337/admin`);
    console.log('');
    console.log('El moderador puede:');
    console.log('- Crear, editar y eliminar foros');
    console.log('- Ver y eliminar comentarios');
    console.log('- NO tiene acceso a otras configuraciones de admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupModeratorRole();