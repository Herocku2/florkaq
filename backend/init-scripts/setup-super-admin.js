const setupSuperAdmin = async () => {
  try {
    console.log('👑 Configurando Super Administrador...');

    // Verificar si ya existe el super admin
    const existingSuperAdmin = await strapi.query('admin::user').findOne({
      where: { email: 'admin@florkafun.com' }
    });

    if (existingSuperAdmin) {
      console.log('✅ Super Administrador ya existe');
      return existingSuperAdmin;
    }

    // Obtener el rol de Super Admin (viene por defecto en Strapi)
    const superAdminRole = await strapi.query('admin::role').findOne({
      where: { code: 'strapi-super-admin' }
    });

    if (!superAdminRole) {
      console.log('❌ Rol de Super Admin no encontrado');
      return null;
    }

    // Crear usuario Super Administrador
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123456', 12);

    const superAdminUser = await strapi.query('admin::user').create({
      data: {
        firstname: 'Super',
        lastname: 'Admin',
        username: 'superadmin',
        email: 'admin@florkafun.com',
        password: hashedPassword,
        isActive: true,
        blocked: false,
        preferedLanguage: 'es'
      }
    });

    // Asignar el rol de Super Admin
    await strapi.query('admin::user').update({
      where: { id: superAdminUser.id },
      data: {
        roles: [superAdminRole.id]
      }
    });

    console.log('✅ Super Administrador creado:', superAdminUser.email);
    console.log('🔑 Credenciales: admin@florkafun.com / admin123456');
    
    return superAdminUser;

  } catch (error) {
    console.error('❌ Error configurando Super Administrador:', error.message);
    return null;
  }
};

module.exports = setupSuperAdmin;