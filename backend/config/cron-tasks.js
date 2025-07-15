module.exports = {
  // CRON job para finalizar votaciones
  '0 0 * * *': async ({ strapi }) => {
    console.log('🗳️ Ejecutando CRON job: Finalización de votaciones');
    
    try {
      const now = new Date();
      
      // Buscar votaciones que han finalizado pero siguen activas
      const votacionesFinalizadas = await strapi.entityService.findMany('api::votacion.votacion', {
        filters: {
          activa: true,
          fechaFin: { $lt: now }
        }
      });

      for (const votacion of votacionesFinalizadas) {
        // Determinar ganador
        const resultados = votacion.resultados || {};
        let ganador = null;
        let maxVotos = 0;
        
        Object.keys(resultados).forEach(candidato => {
          if (resultados[candidato] > maxVotos) {
            maxVotos = resultados[candidato];
            ganador = candidato;
          }
        });

        // Marcar votación como finalizada
        await strapi.entityService.update('api::votacion.votacion', votacion.id, {
          data: {
            activa: false,
            tokenGanador: ganador
          }
        });

        // Si hay ganador, moverlo a próximos lanzamientos
        if (ganador) {
          // Calcular fecha de lanzamiento (próximo viernes)
          const fechaLanzamiento = new Date();
          const diasHastaViernes = (5 - fechaLanzamiento.getDay() + 7) % 7;
          fechaLanzamiento.setDate(fechaLanzamiento.getDate() + (diasHastaViernes === 0 ? 7 : diasHastaViernes));

          // Crear o actualizar token ganador
          await strapi.entityService.create('api::token.token', {
            data: {
              nombre: ganador,
              descripcion: `Token ganador de la votación: ${votacion.titulo}`,
              estado: 'proximo',
              fechaLanzamiento: fechaLanzamiento,
              red: 'solana-mainnet'
            }
          });

          console.log(`✅ Token ${ganador} movido a próximos lanzamientos para ${fechaLanzamiento.toDateString()}`);
        }
      }

      console.log(`✅ Procesadas ${votacionesFinalizadas.length} votaciones finalizadas`);
    } catch (error) {
      console.error('❌ Error en CRON job de votaciones:', error);
    }
  },

  // CRON job para lanzar tokens programados
  '0 9 * * *': async ({ strapi }) => {
    console.log('🚀 Ejecutando CRON job: Lanzamiento de tokens');
    
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const mañana = new Date(hoy);
      mañana.setDate(mañana.getDate() + 1);

      // Buscar tokens programados para hoy
      const tokensParaLanzar = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'proximo',
          fechaLanzamiento: {
            $gte: hoy,
            $lt: mañana
          }
        }
      });

      for (const token of tokensParaLanzar) {
        // Simular creación en blockchain (aquí iría la integración real con Solana)
        const mintAddress = `${token.nombre.substring(0, 4)}${Date.now()}${Math.random().toString(36).substring(2, 8)}`;

        // Actualizar token a lanzado
        await strapi.entityService.update('api::token.token', token.id, {
          data: {
            estado: 'lanzado',
            mintAddress: mintAddress,
            fechaLanzamiento: new Date()
          }
        });

        console.log(`🚀 Token ${token.nombre} lanzado con dirección: ${mintAddress}`);
      }

      console.log(`✅ Lanzados ${tokensParaLanzar.length} tokens`);
    } catch (error) {
      console.error('❌ Error en CRON job de lanzamientos:', error);
    }
  },

  // CRON job para notificaciones
  '0 10 * * *': async ({ strapi }) => {
    console.log('📧 Ejecutando CRON job: Notificaciones');
    
    try {
      // Aquí irían las notificaciones por email/push
      // Por ahora solo registramos actividad
      
      const tokensLanzadosHoy = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'lanzado',
          fechaLanzamiento: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      for (const token of tokensLanzadosHoy) {
        await strapi.entityService.create('api::actividad.actividad', {
          data: {
            tipo: 'token_creado',
            descripcion: `Token ${token.nombre} ha sido lanzado`,
            usuario: 'system',
            entidadRelacionada: token.id,
            tipoEntidad: 'token'
          }
        });
      }

      console.log(`📧 Procesadas notificaciones para ${tokensLanzadosHoy.length} tokens`);
    } catch (error) {
      console.error('❌ Error en CRON job de notificaciones:', error);
    }
  }
};