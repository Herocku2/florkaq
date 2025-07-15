/**
 * Script para generar datos de prueba (seeds) en FlorkaFun
 * Este script crea datos de ejemplo para desarrollo y testing
 */

const createSampleTokens = async () => {
  try {
    console.log('🪙 Creando tokens de ejemplo...');

    // Verificar si ya existen tokens
    const existingTokens = await strapi.entityService.findMany('api::token.token');
    if (existingTokens && existingTokens.length > 0) {
      console.log('✅ Los tokens de ejemplo ya existen');
      return;
    }

    // Crear tokens de ejemplo
    const sampleTokens = [
      {
        nombre: 'DogeCoin Meme',
        descripcion: 'El token meme más popular inspirado en el famoso meme de Doge',
        estado: 'lanzado',
        red: 'solana-mainnet',
        fechaLanzamiento: new Date('2024-01-15'),
        mintAddress: 'DQhH2aMHiMHiQPwjUKXVrVvUDTJ4LVjccjFKdTGB9o6a'
      },
      {
        nombre: 'Pepe Token',
        descripcion: 'Token basado en el icónico meme de Pepe the Frog',
        estado: 'lanzado',
        red: 'solana-mainnet',
        fechaLanzamiento: new Date('2024-02-01'),
        mintAddress: 'PePeH2aMHiMHiQPwjUKXVrVvUDTJ4LVjccjFKdTGB9o6b'
      },
      {
        nombre: 'Shiba Moon',
        descripcion: 'El próximo gran token meme que llegará a la luna',
        estado: 'próximo',
        red: 'solana-mainnet',
        fechaLanzamiento: new Date('2024-12-25')
      }
    ];

    for (const tokenData of sampleTokens) {
      await strapi.entityService.create('api::token.token', {
        data: tokenData
      });
    }

    console.log('✅ Tokens de ejemplo creados');

  } catch (error) {
    console.error('❌ Error creando tokens de ejemplo:', error);
  }
};

const createSampleVotaciones = async () => {
  try {
    console.log('🗳️ Creando votaciones de ejemplo...');

    // Verificar si ya existen votaciones
    const existingVotaciones = await strapi.entityService.findMany('api::votacion.votacion');
    if (existingVotaciones && existingVotaciones.length > 0) {
      console.log('✅ Las votaciones de ejemplo ya existen');
      return;
    }

    // Crear candidatos para votación
    const candidatos = [
      {
        nombre: 'Bukele Coin',
        descripcion: 'Token inspirado en el presidente de El Salvador',
        estado: 'inactivo',
        red: 'solana-mainnet'
      },
      {
        nombre: 'Gustavo Petro Token',
        descripcion: 'Token meme del presidente colombiano',
        estado: 'inactivo',
        red: 'solana-mainnet'
      },
      {
        nombre: 'Barack Obama Coin',
        descripcion: 'Token del expresidente estadounidense',
        estado: 'inactivo',
        red: 'solana-mainnet'
      }
    ];

    const createdCandidatos = [];
    for (const candidatoData of candidatos) {
      const candidato = await strapi.entityService.create('api::token.token', {
        data: candidatoData
      });
      createdCandidatos.push(candidato.id);
    }

    // Crear votación activa
    const votacion = await strapi.entityService.create('api::votacion.votacion', {
      data: {
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
        candidatos: createdCandidatos
      }
    });

    console.log('✅ Votaciones de ejemplo creadas');

  } catch (error) {
    console.error('❌ Error creando votaciones de ejemplo:', error);
  }
};

const createSamplePaquetes = async () => {
  try {
    console.log('📦 Creando paquetes de ejemplo...');

    // Verificar si ya existen paquetes
    const existingPaquetes = await strapi.entityService.findMany('api::paquete.paquete');
    if (existingPaquetes && existingPaquetes.length > 0) {
      console.log('✅ Los paquetes de ejemplo ya existen');
      return;
    }

    // Crear paquetes de ejemplo
    const samplePaquetes = [
      {
        nombre: 'Básico',
        precio: 50,
        nivel: 1,
        caracteristicas: [
          'Creación de token básico',
          'Logo simple',
          'Listado en la plataforma'
        ],
        beneficios: [
          'Visibilidad básica',
          'Soporte por email'
        ]
      },
      {
        nombre: 'Estándar',
        precio: 1500,
        nivel: 2,
        caracteristicas: [
          'Creación de token avanzado',
          'Logo profesional',
          'Listado destacado',
          'Marketing básico'
        ],
        beneficios: [
          'Visibilidad destacada',
          'Soporte prioritario',
          'Promoción en redes sociales'
        ]
      },
      {
        nombre: 'Premium',
        precio: 3000,
        nivel: 3,
        caracteristicas: [
          'Creación de token premium',
          'Branding completo',
          'Listado VIP',
          'Marketing avanzado',
          'Whitepaper básico'
        ],
        beneficios: [
          'Máxima visibilidad',
          'Soporte 24/7',
          'Campaña de marketing completa',
          'Asesoría técnica'
        ]
      },
      {
        nombre: 'Enterprise',
        precio: 5000,
        nivel: 4,
        caracteristicas: [
          'Solución empresarial completa',
          'Branding personalizado',
          'Listado exclusivo',
          'Marketing profesional',
          'Whitepaper profesional',
          'Auditoría de seguridad'
        ],
        beneficios: [
          'Visibilidad exclusiva',
          'Soporte dedicado',
          'Campaña de marketing premium',
          'Consultoría completa',
          'Garantía de lanzamiento'
        ]
      }
    ];

    for (const paqueteData of samplePaquetes) {
      await strapi.entityService.create('api::paquete.paquete', {
        data: paqueteData
      });
    }

    console.log('✅ Paquetes de ejemplo creados');

  } catch (error) {
    console.error('❌ Error creando paquetes de ejemplo:', error);
  }
};

module.exports = async () => {
  try {
    console.log('🌱 Iniciando generación de datos de prueba...');

    // Verificar que Strapi esté completamente cargado
    if (!strapi.isLoaded) {
      console.log('⏳ Esperando a que Strapi se cargue completamente...');
      return;
    }

    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      console.log('ℹ️ Seeds solo se ejecutan en desarrollo');
      return;
    }

    await createSampleTokens();
    await createSampleVotaciones();
    await createSamplePaquetes();

    console.log('🎉 Datos de prueba generados exitosamente');

  } catch (error) {
    console.error('❌ Error generando datos de prueba:', error);
  }
};