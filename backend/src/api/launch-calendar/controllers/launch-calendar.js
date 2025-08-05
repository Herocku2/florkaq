'use strict';

/**
 * launch-calendar controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::launch-calendar.launch-calendar', ({ strapi }) => ({
  // Obtener fechas disponibles para lanzamiento
  async getAvailableDates(ctx) {
    try {
      const today = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(today.getMonth() + 3);

      // Obtener fechas existentes en el calendario
      const existingDates = await strapi.entityService.findMany('api::launch-calendar.launch-calendar', {
        filters: {
          launchDate: {
            $gte: today.toISOString().split('T')[0],
            $lte: threeMonthsFromNow.toISOString().split('T')[0]
          }
        },
        sort: { launchDate: 'asc' }
      });

      // Generar todos los viernes en los próximos 3 meses
      const fridayDates = this.generateFridayDates(today, threeMonthsFromNow);
      
      // Combinar con fechas existentes
      const availableDates = fridayDates.map(friday => {
        const existing = existingDates.find(date => 
          new Date(date.launchDate).toISOString().split('T')[0] === friday
        );
        
        return {
          date: friday,
          available: existing ? existing.slotsUsed < existing.maxSlots : true,
          slotsUsed: existing ? existing.slotsUsed : 0,
          maxSlots: existing ? existing.maxSlots : 2,
          id: existing ? existing.id : null
        };
      });

      ctx.body = {
        data: availableDates,
        meta: {
          total: availableDates.length,
          available: availableDates.filter(d => d.available).length
        }
      };
    } catch (error) {
      console.error('Error getting available dates:', error);
      ctx.throw(500, 'Error obteniendo fechas disponibles');
    }
  },

  // Reservar una fecha para lanzamiento
  async reserveDate(ctx) {
    try {
      const { date, tokenRequestId } = ctx.request.body;
      
      if (!date || !tokenRequestId) {
        return ctx.badRequest('Fecha y ID de solicitud son requeridos');
      }

      // Verificar que la fecha sea un viernes
      const selectedDate = new Date(date);
      if (selectedDate.getDay() !== 5) {
        return ctx.badRequest('Solo se pueden reservar fechas de viernes');
      }

      // Buscar o crear entrada en el calendario
      let calendarEntry = await strapi.entityService.findMany('api::launch-calendar.launch-calendar', {
        filters: { launchDate: date }
      });

      if (calendarEntry.length > 0) {
        calendarEntry = calendarEntry[0];
        
        // Verificar disponibilidad
        if (calendarEntry.slotsUsed >= calendarEntry.maxSlots) {
          return ctx.badRequest('No hay slots disponibles para esta fecha');
        }

        // Actualizar slots usados
        await strapi.entityService.update('api::launch-calendar.launch-calendar', calendarEntry.id, {
          data: {
            slotsUsed: calendarEntry.slotsUsed + 1,
            available: (calendarEntry.slotsUsed + 1) < calendarEntry.maxSlots
          }
        });
      } else {
        // Crear nueva entrada
        calendarEntry = await strapi.entityService.create('api::launch-calendar.launch-calendar', {
          data: {
            launchDate: date,
            slotsUsed: 1,
            maxSlots: 2,
            available: true
          }
        });
      }

      // Actualizar la solicitud de token con la fecha seleccionada
      await strapi.entityService.update('api::solicitud-token.solicitud-token', tokenRequestId, {
        data: {
          selectedLaunchDate: calendarEntry.id,
          launchDateSelected: date
        }
      });

      ctx.body = {
        success: true,
        message: 'Fecha reservada exitosamente',
        data: {
          calendarEntry,
          reservedDate: date
        }
      };
    } catch (error) {
      console.error('Error reserving date:', error);
      ctx.throw(500, 'Error reservando fecha');
    }
  },

  // Generar fechas de viernes
  generateFridayDates(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    
    // Ir al próximo viernes
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Recopilar todos los viernes hasta la fecha final
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 7); // Siguiente viernes
    }
    
    return dates;
  }
}));