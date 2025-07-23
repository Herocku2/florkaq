const resetAdmin = async () => {
  try {
    console.log('🔄 Reseteando credenciales de administrador...');

    // Buscar usuario admin existente
    let adminUser = await strapi.query('admin::user').findOne({
      where: { email: 'herockudev@gmail.com' }
    });

    if (!adminUser) {
      // Si no existe con ese email, buscar por cualquier admin
      adminUser = await strapi.query('admin::user').findOne({
        populate: ['roles']
      });
    }

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador');
      return null;
    }

    // Obtener el rol de Super Admin
    const superAdminRole = await strapi.query('admin::role').findOne({
      where: { code: 'strapi-super-admin' }
    });

    if (!superAdminRole) {
      console.log('❌ Rol de Super Admin no encontrado');
      return null;
    }

    // Actualizar credenciales
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Nicolas2025', 12);

    const updatedUser = await strapi.query('admin::user').update({
      where: { id: adminUser.id },
      data: {
        firstname: 'Admin',
        lastname: 'FlorkaFun',
        username: 'admin',
        email: 'herockudev@gmail.com',
        password: hashedPassword,
        isActive: true,
        blocked: false,
        preferedLanguage: 'es',
        roles: [superAdminRole.id]
      }
    });

    console.log('✅ Credenciales de administrador actualizadas');
    console.log('📧 Email: herockudev@gmail.com');
    console.log('🔑 Password: Nicolas2025');
    
    return updatedUser;

  } catch (error) {
    console.error('❌ Error reseteando administrador:', error.message);
    return null;
  }
};

module.exports = resetAdmin;