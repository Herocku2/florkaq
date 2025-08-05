import React, { useState, useEffect } from 'react';
import './LaunchCalendar.css';

const LaunchCalendar = ({ isOpen, onClose, onDateSelected, tokenRequestId }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadAvailableDates();
    }
  }, [isOpen]);

  const loadAvailableDates = async () => {
    try {
      setLoading(true);
      const tokenRequestService = (await import('../../services/tokenRequestService')).default;
      const response = await tokenRequestService.getAvailableLaunchDates();
      setAvailableDates(response.data || []);
    } catch (error) {
      console.error('Error loading available dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleConfirmSelection = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      
      // Reservar la fecha en el backend
      const response = await fetch('http://localhost:1337/api/launch-calendar/reserve-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.date,
          tokenRequestId: tokenRequestId
        }),
      });

      if (!response.ok) {
        throw new Error('Error reservando fecha');
      }

      const result = await response.json();
      
      if (result.success) {
        onDateSelected(selectedDate);
        onClose();
      } else {
        alert('Error al reservar la fecha. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error reserving date:', error);
      alert('Error al reservar la fecha. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-modal-overlay">
      <div className="calendar-modal">
        <div className="calendar-modal-header">
          <h2>📅 Seleccionar Fecha de Lanzamiento</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="calendar-modal-content">
          <div className="calendar-info">
            <p>
              🚀 Los tokens se lanzan únicamente los <strong>viernes</strong> de cada semana.
              <br />
              📊 Máximo <strong>2 tokens por viernes</strong> para garantizar la mejor exposición.
            </p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Cargando fechas disponibles...</p>
            </div>
          ) : (
            <>
              <div className="dates-grid">
                {availableDates.map((dateInfo, index) => (
                  <div
                    key={index}
                    className={`date-card ${!dateInfo.available ? 'unavailable' : ''} ${
                      selectedDate?.date === dateInfo.date ? 'selected' : ''
                    }`}
                    onClick={() => dateInfo.available && handleDateSelect(dateInfo)}
                  >
                    <div className="date-header">
                      <span className="date-day">
                        {new Date(dateInfo.date).getDate()}
                      </span>
                      <span className="date-month">
                        {new Date(dateInfo.date).toLocaleDateString('es-ES', { month: 'short' })}
                      </span>
                    </div>
                    
                    <div className="date-info">
                      <div className="slots-info">
                        <span className="slots-used">{dateInfo.slotsUsed}</span>
                        <span className="slots-separator">/</span>
                        <span className="slots-total">{dateInfo.maxSlots}</span>
                      </div>
                      
                      <div className={`availability-badge ${dateInfo.available ? 'available' : 'full'}`}>
                        {dateInfo.available ? '✅ Disponible' : '❌ Completo'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedDate && (
                <div className="selected-date-info">
                  <h3>📅 Fecha Seleccionada</h3>
                  <p className="selected-date-text">
                    {formatDate(selectedDate.date)}
                  </p>
                  <p className="selected-date-details">
                    Slots disponibles: {selectedDate.maxSlots - selectedDate.slotsUsed} de {selectedDate.maxSlots}
                  </p>
                </div>
              )}

              <div className="calendar-actions">
                <button className="btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleConfirmSelection}
                  disabled={!selectedDate || loading}
                >
                  {loading ? 'Reservando...' : 'Confirmar Fecha'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchCalendar;