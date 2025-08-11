module.exports = {
  // Deshabilitar i18n para evitar errores de localización
  i18n: {
    enabled: false,
  },
  
  // Configuración de upload
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000000, // 100MB
      },
    },
  },
  
  // Configuración de users-permissions
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['username', 'email', 'password'],
      },
    },
  },
};