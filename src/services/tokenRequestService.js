const API_BASE_URL = 'http://localhost:1337/api';

class TokenRequestService {
  // Crear nueva solicitud de token
  async createTokenRequest(requestData) {
    try {
      console.log('🚀 Enviando solicitud de token:', requestData);
      
      const formData = new FormData();
      
      // Agregar imagen si existe
      if (requestData.tokenImage) {
        formData.append('files.tokenImage', requestData.tokenImage);
      }
      
      // Preparar datos sin la imagen
      const dataWithoutImage = { ...requestData };
      delete dataWithoutImage.tokenImage;
      
      formData.append('data', JSON.stringify(dataWithoutImage));
      
      const response = await fetch(`${API_BASE_URL}/solicitud-tokens`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Solicitud creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creando solicitud de token:', error);
      throw error;
    }
  }

  // Obtener todas las solicitudes (solo admin)
  async getTokenRequests(page = 1, pageSize = 25) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/solicitud-tokens?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo solicitudes:', error);
      throw error;
    }
  }

  // Obtener una solicitud específica
  async getTokenRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/solicitud-tokens/${id}?populate=*`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo solicitud:', error);
      throw error;
    }
  }

  // Actualizar estado de solicitud (solo admin)
  async updateTokenRequest(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/solicitud-tokens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updateData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error actualizando solicitud:', error);
      throw error;
    }
  }

  // Simular integración con NOWPayments
  async processPayment(paymentData) {
    try {
      console.log('💳 Procesando pago con NOWPayments:', paymentData);
      
      // Simular llamada a NOWPayments API
      const nowPaymentsRequest = {
        price_amount: paymentData.amount,
        price_currency: 'USD',
        pay_currency: paymentData.currency || 'btc',
        order_id: paymentData.orderId,
        order_description: paymentData.description,
        success_url: paymentData.successUrl,
        cancel_url: paymentData.cancelUrl,
      };
      
      // Simular respuesta exitosa
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            payment_id: 'np_' + Math.random().toString(36).substring(2, 15),
            payment_status: 'waiting',
            pay_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            price_amount: paymentData.amount,
            price_currency: 'USD',
            pay_amount: (paymentData.amount / 45000).toFixed(8), // Simular conversión BTC
            pay_currency: paymentData.currency || 'btc',
            order_id: paymentData.orderId,
            payment_url: `https://nowpayments.io/payment/?iid=np_${Math.random().toString(36).substring(2, 15)}`
          });
        }, 1000);
      });
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      throw error;
    }
  }

  // Verificar estado del pago
  async checkPaymentStatus(paymentId) {
    try {
      console.log('🔍 Verificando estado del pago:', paymentId);
      
      // Simular verificación de pago
      return new Promise((resolve) => {
        setTimeout(() => {
          const statuses = ['waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          resolve({
            payment_id: paymentId,
            payment_status: randomStatus,
            pay_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            price_amount: 50,
            price_currency: 'USD',
            pay_amount: '0.00111111',
            pay_currency: 'btc',
            order_id: 'order_' + Date.now(),
            order_description: 'Token Creation Service',
            purchase_id: 'purchase_' + Date.now(),
            outcome_amount: randomStatus === 'finished' ? '0.00111111' : '0',
            outcome_currency: 'btc'
          });
        }, 1500);
      });
    } catch (error) {
      console.error('❌ Error verificando pago:', error);
      throw error;
    }
  }
}

const tokenRequestService = new TokenRequestService();
export default tokenRequestService;