/**
 * Script para poblar candidatos con imágenes de ejemplo
 */

const createCandidatesWithImages = async () => {
  try {
    console.log('👥 Creando candidatos con imágenes...');

    // Verificar si ya existen candidatos
    const existingCandidatos = await strapi.entityService.findMany('api::candidato.candidato');
    if (existingCandidatos && existingCandidatos.length > 0) {
      console.log('✅ Los candidatos ya existen');
      return existingCandidatos;
    }

    // Datos de candidatos de ejemplo
    const candidatosData = [
      {
        nombre: 'Bukele Coin',
        descripcion: 'Token inspirado en el presidente de El Salvador, Nayib Bukele',
        categoria: 'meme',
        activo: true,
        fechaCreacion: new Date(),
        votos: 0
      },
      {
        nombre: 'Obama Token',
        descripcion: 'Token meme del expresidente estadounidense Barack Obama',
        categoria: 'meme',
        activo: true,
        fechaCreacion: new Date(),
        votos: 0
      },
      {
        nombre: 'Petro Coin',
        descripcion: 'Token del presidente colombiano Gustavo Petro',
        categoria: 'meme',
        activo: true,
        fechaCreacion: new Date(),
        votos: 0
      }
    ];

    const createdCandidatos = [];
    
    for (const candidatoData of candidatosData) {
      const candidato = await strapi.entityService.create('api::candidato.candidato', {
        data: candidatoData
      });
      createdCandidatos.push(candidato);
    }

    console.log('✅ Candidatos creados exitosamente');
    return createdCandidatos;

  } catch (error) {
    console.error('❌ Error creando candidatos:', error);
    throw error;
  }
};

const createActiveVotacion = async (candidatos) => {
  try {
    console.log('🗳️ Creando votación activa...');

    // Verificar si ya existe una votación activa
    const existingVotacion = await strapi.entityService.findMany('api::votacion.votacion', {
      filters: { activa: true }
    });

    if (existingVotacion && existingVotacion.length > 0) {
      console.log('✅ Ya existe una votación activa');
      return existingVotacion[0];
    }

    // Crear votación activa
    const votacion = await strapi.entityService.create('api::votacion.votacion', {
      data: {
        titulo: 'Votación de Tokens Meme',
        descripcion: 'Vota por tu token meme favorito para el próximo lanzamiento',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        activa: true,
        candidatos: candidatos.map(c => c.id),
        totalVotos: 0,
        resultados: {}
      }
    });

    console.log('✅ Votación activa creada');
    return votacion;

  } catch (error) {
    console.error('❌ Error creando votación:', error);
    throw error;
  }
};

module.exports = async () => {
  try {
    console.log('🚀 Iniciando población de candidatos...');

    // Verificar que Strapi esté completamente cargado
    if (!strapi.isLoaded) {
      console.log('⏳ Esperando a que Strapi se cargue completamente...');
      return;
    }

    const candidatos = await createCandidatesWithImages();
    await createActiveVotacion(candidatos);

    console.log('🎉 Candidatos y votación creados exitosamente');

  } catch (error) {
    console.error('❌ Error en la población de candidatos:', error);
  }
};