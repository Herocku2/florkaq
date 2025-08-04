import React, { useState } from 'react';
import tokenRequestService from '../../../services/tokenRequestService';

const Step5PaymentSummary = ({ formData, updateFormData, prevStep, user }) => {
  const [paymentStep, setPaymentStep] = useState('summary'); // 'summary', 'payment', 'success'
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    btc: '0.002309 BTC',
    eth: '0.03915 ETH',
    symbol: 'XRP',
    otherMethod: '16.5567 XRP',
    payoutEnding: '30 days left',
    participants: '7254563',
    liquidityEnding: '1.15 days',
    liquidityPercent: '165 days',
    auditPassed: '10%',
    iddo: '89542.26 BNB'
  });

  const handlePaymentProcess = async () => {
    setLoading(true);
    setPaymentStep('payment');
    
    try {
      // Integración real con NOWPayments
      const paymentRequest = {
        amount: formData.selectedPlan.price,
        currency: 'btc',
        orderId: `TOKEN_${Date.now()}`,
        description: `Token Creation - ${formData.selectedPlan.name}`,
        successUrl: window.location.origin + '/create/success',
        cancelUrl: window.location.origin + '/create/cancel'
      };
      
      console.log('🚀 Procesando pago:', paymentRequest);
      
      // Llamar al servicio de pago
      const paymentResult = await tokenRequestService.processPayment(paymentRequest);
      
      if (paymentResult.success) {
        const paymentHash = paymentResult.payment_id;
        updateFormData({ 
          paymentHash: paymentHash,
          paymentStatus: 'completed',
          paymentId: paymentResult.payment_id,
          paymentUrl: paymentResult.payment_url
        });
        setPaymentStep('success');
      } else {
        throw new Error('Error en el procesamiento del pago');
      }
      
    } catch (error) {
      console.error('❌ Error en el pago:', error);
      alert('Error procesando el pago. Por favor, inténtalo de nuevo.');
      setPaymentStep('summary');
    } finally {
      setLoading(false);
    }
  };

  const submitTokenRequest = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para envío
      const requestData = {
        ...formData,
        userId: user?.id || 'anonymous',
        requestStatus: 'pending_review',
        createdAt: new Date().toISOString()
      };
      
      console.log('📤 Enviando solicitud de token:', requestData);
      
      // Enviar solicitud al backend
      const result = await tokenRequestService.createTokenRequest(requestData);
      
      if (result && result.data) {
        alert(`¡Solicitud enviada exitosamente! 
        
ID de Solicitud: ${result.data.id}
Hash de Pago: ${formData.paymentHash}
Plan: ${formData.selectedPlan.name}
Token: ${formData.tokenName} (${formData.tokenSymbol})

Recibirás un email de confirmación pronto.`);
        
        // Redirigir al home después de 3 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
      
    } catch (error) {
      console.error('❌ Error enviando solicitud:', error);
      alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="step-form">
        <div className="success-container" style={{
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#22c55e', marginBottom: '20px' }}>
            ¡Pago Completado Exitosamente!
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
            Tu solicitud de creación de token ha sido procesada.
          </p>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#22c55e', marginBottom: '15px' }}>
              Detalles de la Transacción
            </h3>
            <p><strong>Hash de Pago:</strong> {formData.paymentHash}</p>
            <p><strong>Plan:</strong> {formData.selectedPlan.name}</p>
            <p><strong>Monto:</strong> ${formData.selectedPlan.price} USD</p>
            <p><strong>Token:</strong> {formData.tokenName} ({formData.tokenSymbol})</p>
          </div>
          
          <button
            onClick={submitTokenRequest}
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Finalizar Solicitud
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="step-form">
        <div className="payment-container">
          <h2 className="section-title">
            💳 Complete Payment on Solana Mainnet
          </h2>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🚀</div>
            <p style={{ marginBottom: '20px' }}>
              Connect your Solana wallet to proceed with payment
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Select Wallet
            </button>
          </div>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
              <p>Procesando pago...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="step-form">
      <div className="form-section">
        <h2 className="section-title">
          💰 Payment
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
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
            Complete your payment to create your token
          </p>
        </div>
        
        <div className="payment-features" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ff6b9d', marginBottom: '15px' }}>
            Tu plan incluye:
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
        
        <div className="payment-methods" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div className="payment-method" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>BTC</div>
            <div style={{ fontSize: '0.9rem' }}>{paymentData.btc}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Payout ending: {paymentData.payoutEnding}
            </div>
          </div>
          
          <div className="payment-method" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>ETH</div>
            <div style={{ fontSize: '0.9rem' }}>{paymentData.eth}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Participants: {paymentData.participants}
            </div>
          </div>
          
          <div className="payment-method" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Symbol</div>
            <div style={{ fontSize: '0.9rem' }}>{paymentData.symbol}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Blockchain presale: BNB
            </div>
          </div>
          
          <div className="payment-method" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Otro método</div>
            <div style={{ fontSize: '0.9rem' }}>{paymentData.otherMethod}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Liquidity location: 90%
            </div>
          </div>
        </div>
        
        <div className="sale-rate" style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ 
            color: '#ff6b9d', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            Sale Rate
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Listing Rate
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 107, 157, 0.1)',
          border: '1px solid rgba(255, 107, 157, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🚀</div>
          <div style={{ color: '#ff6b9d', fontWeight: 'bold', marginBottom: '10px' }}>
            Complete Payment on Solana Mainnet
          </div>
          <p style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
            Connect your Solana wallet to proceed with payment
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Select Wallet
          </button>
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
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            fontSize: '1.1rem',
            padding: '15px 30px'
          }}
        >
          Process Payment
        </button>
      </div>
    </div>
  );
};

export default Step5PaymentSummary;