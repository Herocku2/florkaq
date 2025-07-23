const { execSync } = require('child_process');

async function populateRankings() {
  try {
    console.log('🚀 Poblando rankings con datos de ejemplo...');
    
    // Esperar a que Strapi esté listo
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Crear rankings de ejemplo usando curl
    const rankings = [
      {
        posicion: 1,
        totalVotos: 28,
        fechaActualizacion: new Date().toISOString(),
        activo: true,
        token: 2 // ID del token Bukele
      },
      {
        posicion: 2,
        totalVotos: 15,
        fechaActualizacion: new Date().toISOString(),
        activo: true,
        token: 3 // ID del token Gustavo Petro
      },
      {
        posicion: 3,
        totalVotos: 8,
        fechaActualizacion: new Date().toISOString(),
        activo: true,
        token: 4 // ID del token Barack Obama
      }
    ];

    for (const ranking of rankings) {
      try {
        const curlCommand = `curl -X POST http://localhost:1337/api/rankings \\
          -H "Content-Type: application/json" \\
          -d '{"data": ${JSON.stringify(ranking)}}'`;
        
        console.log(`Creando ranking posición ${ranking.posicion}...`);
        execSync(curlCommand, { stdio: 'inherit' });
      } catch (error) {
        console.log(`Ranking posición ${ranking.posicion} ya existe o error:`, error.message);
      }
    }
    
    console.log('✅ Rankings poblados exitosamente');
  } catch (error) {
    console.error('❌ Error poblando rankings:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  populateRankings();
}

module.exports = populateRankings;