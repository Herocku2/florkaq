#!/usr/bin/env node

/**
 * Herramientas de administración para FlorkaFun
 * Uso: node admin-tools.js <comando> <parametros>
 */

const { execSync } = require('child_process');

const commands = {
  'list-users': listUsers,
  'make-moderator': makeModerator,
  'make-admin': makeAdmin,
  'make-user': makeUser,
  'show-user': showUser
};

async function listUsers() {
  console.log('👥 Listando todos los usuarios...\n');
  
  try {
    const query = `SELECT id, nombre, email, rol, fechaRegistro, activo FROM usuarios ORDER BY fechaRegistro DESC;`;
    const result = execSync(`docker exec florkafun-strapi sqlite3 .tmp/data.db "${query}"`, {
      encoding: 'utf8'
    });
    
    console.log('ID | Nombre | Email | Rol | Fecha Registro | Activo');
    console.log('---|--------|-------|-----|----------------|-------');
    console.log(result);
  } catch (error) {
    console.error('❌ Error listando usuarios:', error.message);
  }
}

async function showUser() {
  const email = process.argv[3];
  
  if (!email) {
    console.log('❌ Uso: node admin-tools.js show-user <email>');
    return;
  }

  console.log(`🔍 Información del usuario: ${email}\n`);
  
  try {
    const query = `SELECT * FROM usuarios WHERE email = '${email}';`;
    const result = execSync(`docker exec florkafun-strapi sqlite3 .tmp/data.db "${query}"`, {
      encoding: 'utf8'
    });
    
    console.log(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function makeModerator() {
  const email = process.argv[3];
  
  if (!email) {
    console.log('❌ Uso: node admin-tools.js make-moderator <email>');
    return;
  }

  console.log(`🛡️ Convirtiendo ${email} en moderador...\n`);
  await changeUserRole(email, 'moderador');
}

async function makeAdmin() {
  const email = process.argv[3];
  
  if (!email) {
    console.log('❌ Uso: node admin-tools.js make-admin <email>');
    return;
  }

  console.log(`👑 Convirtiendo ${email} en administrador...\n`);
  await changeUserRole(email, 'admin');
}

async function makeUser() {
  const email = process.argv[3];
  
  if (!email) {
    console.log('❌ Uso: node admin-tools.js make-user <email>');
    return;
  }

  console.log(`👤 Convirtiendo ${email} en usuario estándar...\n`);
  await changeUserRole(email, 'usuario');
}

async function changeUserRole(email, newRole) {
  try {
    // Verificar que el usuario existe
    const checkQuery = `SELECT nombre, email, rol FROM usuarios WHERE email = '${email}';`;
    const userCheck = execSync(`docker exec florkafun-strapi sqlite3 .tmp/data.db "${checkQuery}"`, {
      encoding: 'utf8'
    });

    if (!userCheck.includes(email)) {
      console.log('❌ Usuario no encontrado en la base de datos');
      console.log('💡 Usuarios disponibles:');
      await listUsers();
      return;
    }

    // Actualizar rol
    const updateQuery = `UPDATE usuarios SET rol = '${newRole}' WHERE email = '${email}';`;
    const result = execSync(`docker exec florkafun-strapi sqlite3 .tmp/data.db "${updateQuery}"`, {
      encoding: 'utf8'
    });

    console.log('✅ Rol actualizado exitosamente!');

    // Verificar el cambio
    const verifyQuery = `SELECT nombre, email, rol FROM usuarios WHERE email = '${email}';`;
    const verification = execSync(`docker exec florkafun-strapi sqlite3 .tmp/data.db "${verifyQuery}"`, {
      encoding: 'utf8'
    });

    console.log('🔍 Estado actual:');
    console.log(verification);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - Docker esté corriendo');
    console.log('   - El contenedor florkafun-strapi esté activo');
    console.log('   - El email exista en la base de datos');
  }
}

function showHelp() {
  console.log('🛠️  Herramientas de Administración FlorkaFun\n');
  console.log('Comandos disponibles:');
  console.log('  list-users              - Listar todos los usuarios');
  console.log('  show-user <email>       - Mostrar información de un usuario');
  console.log('  make-moderator <email>  - Convertir usuario en moderador');
  console.log('  make-admin <email>      - Convertir usuario en administrador');
  console.log('  make-user <email>       - Convertir en usuario estándar');
  console.log('\nEjemplos:');
  console.log('  node admin-tools.js list-users');
  console.log('  node admin-tools.js make-moderator usuario@example.com');
  console.log('  node admin-tools.js show-user usuario@example.com');
}

// Ejecutar comando
const command = process.argv[2];

if (!command || !commands[command]) {
  showHelp();
  process.exit(1);
}

commands[command]();