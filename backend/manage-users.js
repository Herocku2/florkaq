#!/usr/bin/env node

/**
 * Script para gestionar usuarios usando la API
 * Uso: node manage-users.js <comando> <parametros>
 */

const http = require('http');

const API_BASE = 'http://localhost:1337/api';

const commands = {
  'list': listUsers,
  'show': showUser,
  'make-moderator': makeModerator,
  'make-admin': makeAdmin,
  'make-user': makeUser
};

async function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve(jsonData);
        } catch (error) {
          resolve({ error: 'Invalid JSON response', body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function listUsers() {
  console.log('👥 Listando todos los usuarios...\n');
  
  try {
    const response = await makeRequest('/admin/users');
    
    if (response.success) {
      console.log(`📊 Total de usuarios: ${response.count}\n`);
      
      response.data.forEach((user, index) => {
        const roleEmoji = user.rol === 'admin' ? '👑' : user.rol === 'moderador' ? '🛡️' : '👤';
        const activeStatus = user.activo ? '✅' : '❌';
        
        console.log(`${index + 1}. ${roleEmoji} ${user.nombre}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🎭 Rol: ${user.rol}`);
        console.log(`   📅 Registro: ${new Date(user.fechaRegistro).toLocaleDateString()}`);
        console.log(`   ${activeStatus} Activo: ${user.activo}`);
        console.log('');
      });
    } else {
      console.log('❌ Error:', response.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:1337');
  }
}

async function showUser() {
  const email = process.argv[3];
  
  if (!email) {
    console.log('❌ Uso: node manage-users.js show <email>');
    return;
  }

  console.log(`🔍 Información del usuario: ${email}\n`);
  
  try {
    const response = await makeRequest(`/admin/user/${encodeURIComponent(email)}`);
    
    if (response.success) {
      const user = response.data;
      const roleEmoji = user.rol === 'admin' ? '👑' : user.rol === 'moderador' ? '🛡️' : '👤';
      
      console.log(`${roleEmoji} ${user.nombre}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🎭 Rol: ${user.rol}`);
      console.log(`📅 Registro: ${new Date(user.fechaRegistro).toLocaleDateString()}`);
      console.log(`✅ Activo: ${user.activo}`);
      
      if (user.walletSolana) {
        console.log(`💰 Wallet: ${user.walletSolana}`);
      }
    } else {
      console.log('❌ Usuario no encontrado');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function changeRole(email, newRole) {
  if (!email) {
    console.log(`❌ Uso: node manage-users.js make-${newRole} <email>`);
    return;
  }

  const roleEmojis = {
    'usuario': '👤',
    'moderador': '🛡️',
    'admin': '👑'
  };

  console.log(`${roleEmojis[newRole]} Convirtiendo ${email} en ${newRole}...\n`);
  
  try {
    const response = await makeRequest('/admin/change-role', 'POST', {
      email: email,
      newRole: newRole
    });
    
    if (response.success) {
      console.log('✅', response.message);
      console.log('\n🔍 Estado actualizado:');
      await showUser();
    } else {
      console.log('❌ Error:', response.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function makeModerator() {
  const email = process.argv[3];
  await changeRole(email, 'moderador');
}

async function makeAdmin() {
  const email = process.argv[3];
  await changeRole(email, 'admin');
}

async function makeUser() {
  const email = process.argv[3];
  await changeRole(email, 'usuario');
}

function showHelp() {
  console.log('🛠️  Gestor de Usuarios FlorkaFun\n');
  console.log('Comandos disponibles:');
  console.log('  list                    - Listar todos los usuarios');
  console.log('  show <email>            - Mostrar información de un usuario');
  console.log('  make-moderator <email>  - Convertir usuario en moderador');
  console.log('  make-admin <email>      - Convertir usuario en administrador');
  console.log('  make-user <email>       - Convertir en usuario estándar');
  console.log('\nEjemplos:');
  console.log('  node manage-users.js list');
  console.log('  node manage-users.js make-moderator usuario@example.com');
  console.log('  node manage-users.js show usuario@example.com');
}

// Ejecutar comando
const command = process.argv[2];

if (!command || !commands[command]) {
  showHelp();
  process.exit(1);
}

commands[command]();