import React, { useState } from 'react';
import tokenRequestService from '../../../services/tokenRequestService';

const PublishStep3Payment = ({ formData, updateFormData, prevStep, user, setPaymentModal }) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentProcess = async () => {
    setLoading(true);
    
    try {
      console.log('🚀 Iniciando proceso de pago para listing...');
      console.log('📋 Datos del formulario:', formData);
      
      // Crear pago directamente con NOWPayments
      const paymentRequest = {
        amount: formData.selectedPlan?.price || 50,
        tokenName: formData.tokenName || 'Token Listing',
        orderId: `LISTING_${Date.now()}`,
        description: `Token Listing - ${formData.tokenName || 'Token'} (${formData.selectedPlan?.name || 'Plan'})`,
        successUrl: window.location.origin + '/publish/success',
        cancelUrl: window.location.origin + '/publish/cancel'
      };
      
      console.log('💳 Creando pago con NOWPayments:', paymentRequest);
      const paymentResult = await tokenRequestService.processPayment(paymentRequest);
      
      console.log('✅ Resultado del pago:', paymentResult);
      
      if (paymentResult && paymentResult.payment_id) {
        // Mostrar modal de pago con QR
        setPaymentModal({
          isOpen: true,
          data: paymentResult
        });
        
        // Actualizar datos del formulario
        updateFormData({ 
          paymentHash: paymentResult.payment_id,
          paymentStatus: 'waiting',
          paymentId: paymentResult.payment_id,
          paymentUrl: paymentResult.payment_url || paymentResult.invoice_url
        });
      } else {
        throw new Error('No se recibió respuesta válida de NOWPayments');
      }
      
    } catch (error) {
      console.error('❌ Error en el proceso de pago:', error);
      alert(`Error procesando el pago: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-form">
      <div className="form-section">
        <h2 className="section-title">
          💳 Payment Summary
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, #ff01a1, #ff69b4)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            ${formData.selectedPlan?.price} USD
          </div>
          <p style={{ margin: '10px 0 0 0' }}>
            Complete your payment to list your token
          </p>
        </div>
        
        <div className="listing-summary" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ff01a1', marginBottom: '15px' }}>
            Listing Summary:
          </h3>
          <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Token Name:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.tokenName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Token Symbol:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.tokenSymbol}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Token Type:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.tokenType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Supply:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.totalSupply}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Selected Plan:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.selectedPlan?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Owner Email:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.ownerEmail}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Telegram:</span>
              <span style={{ fontWeight: 'bold' }}>{formData.telegramUsername}</span>
            </div>
          </div>
        </div>
        
        <div className="payment-features" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ff01a1', marginBottom: '15px' }}>
            Your plan includes:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {formData.selectedPlan?.features.map((feature, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#22c55e' }}>•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{
          background: 'rgba(255, 1, 161, 0.1)',
          border: '1px solid rgba(255, 1, 161, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💳</div>
          <div style={{ color: '#ff01a1', fontWeight: 'bold', marginBottom: '10px' }}>
            Payment with NOWPayments
          </div>
          <p style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
            Pay securely with USDT on Solana network
          </p>
        </div>
      </div>
      
      <div className="step-navigation">
        <button
          className="nav-button back"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="nav-button next"
          onClick={handlePaymentProcess}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #ff01a1, #ff69b4)',
            fontSize: '1.1rem',
            padding: '15px 30px'
          }}
        >
          {loading ? 'Processing...' : 'Pay with NOWPayments'}
        </button>
      </div>
    </div>
  );
};

export default PublishStep3Payment;