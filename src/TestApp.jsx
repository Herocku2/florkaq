import React from 'react';

export function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🚀 Florka Fun - Test Local</h1>
      <p>✅ Frontend React funcionando correctamente</p>
      <p>🔗 Backend Strapi: <a href="http://localhost:1337/admin" target="_blank">http://localhost:1337/admin</a></p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '600px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>🎯 Estado del Proyecto</h2>
        <ul style={{ textAlign: 'left' }}>
          <li>✅ Frontend React: Funcionando</li>
          <li>✅ Backend Strapi: Funcionando</li>
          <li>⚠️ Base de datos: Limpia (necesita configuración inicial)</li>
          <li>📝 Próximo paso: Configurar admin en Strapi</li>
        </ul>
      </div>
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '600px'
      }}>
        <h3>📋 Instrucciones</h3>
        <p>1. Ve a <a href="http://localhost:1337/admin" target="_blank">Strapi Admin</a></p>
        <p>2. Crea el usuario administrador</p>
        <p>3. Configura los content types</p>
        <p>4. Vuelve aquí para probar la aplicación completa</p>
      </div>
    </div>
  );
}