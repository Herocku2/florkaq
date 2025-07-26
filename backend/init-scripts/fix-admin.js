/**
 * Script para arreglar y crear el usuario administrador
 */

const fixAdmin = async () => {
  try {
    console.log('🔧 Arreglando usuario administrador...');

    // Eliminar todos los usuarios admin existentes
    await strapi.query('admin::user').deleteMany({});
    console.log('🗑️ Usuarios admin existentes eliminados');

    // Obtener el rol de Super Admin
    let superAdminRole = await strapi.query('admin::role').findOne({
      where: { code: 'strapi-super-admin' }
    });

    if (!superAdminRole) {
      console.log('❌ Rol de Super Admin no encontrado, creando...');
      superAdminRole = await strapi.query('admin::role').create({
        data: {
          name: 'Super Admin',
          code: 'strapi-super-admin',
          description: 'Super Administrators can access and manage all features and settings.',
        }
      });
    }

    // Crear nuevo usuario administrador
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await strapi.query('admin::user').create({
      data: {
        firstname: 'Admin',
        lastname: 'FlorkaFun',
        username: 'admin',
        email: 'admin@florkafun.com',
        password: hashedPassword,
        isActive: true,
        blocked: false,
        preferedLanguage: 'en',
        roles: [superAdminRole.id]
      }
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@florkafun.com');
    console.log('🔑 Password: admin123');
    
    return adminUser;

  } catch (error) {
    console.error('❌ Error arreglando administrador:', error);
    return null;
  }
};

module.exports = fixAdmin;