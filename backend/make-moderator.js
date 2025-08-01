#!/usr/bin/env node

/**
 * Script para convertir un usuario en moderador
 * Uso: node make-moderator.js <email>
 */

const { execSync } = require('child_process');

async function makeModerator() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('❌ Uso: node make-moderator.js <email>');
    console.log('📧 Ejemplo: node make-moderator.js usuario@example.com');
    process.exit(1);
  }

  console.log(`🔍 Buscando usuario con email: ${email}`);

  try {
    // Conectar a la base de datos usando Docker
    const query = `
      UPDATE usuarios 
      SET rol = 'moderador' 
      WHERE email = '${email}';
    `;

    console.log('🔄 Ejecutando actualización...');
    
    const result = execSync(`docker exec florkafun-postgres psql -U strapi -d strapi -c "${query}"`, {
      encoding: 'utf8'
    });

    console.log('✅ Resultado:', result);

    // Verificar el cambio
    const verifyQuery = `SELECT nombre, email, rol FROM usuarios WHERE email = '${email}';`;
    const verification = execSync(`docker exec florkafun-postgres psql -U strapi -d strapi -c "${verifyQuery}"`, {
      encoding: 'utf8'
    });

    console.log('🔍 Verificación:');
    console.log(verification);
    console.log('✅ Usuario convertido a moderador exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - Docker esté corriendo');
    console.log('   - El contenedor florkafun-postgres esté activo');
    console.log('   - El email exista en la base de datos');
  }
}

makeModerator();