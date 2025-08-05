import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, paymentData, onPaymentConfirmed }) => {
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !paymentData) return;

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check payment status every 30 seconds
    const statusChecker = setInterval(async () => {
      if (paymentData.payment_id) {
        try {
          const tokenRequestService = (await import('../../services/tokenRequestService')).default;
          const status = await tokenRequestService.checkPaymentStatus(paymentData.payment_id);
          setPaymentStatus(status.payment_status);
          
          if (status.payment_status === 'finished' || status.payment_status === 'confirmed') {
            clearInterval(statusChecker);
            clearInterval(timer);
            onPaymentConfirmed(status);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(statusChecker);
    };
  }, [isOpen, paymentData, onPaymentConfirmed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return '#f39c12';
      case 'confirming': return '#3498db';
      case 'confirmed': return '#27ae60';
      case 'finished': return '#2ecc71';
      case 'failed': return '#e74c3c';
      case 'expired': return '#95a5a6';
      default: return '#f39c12';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Esperando pago';
      case 'confirming': return 'Confirmando transacción';
      case 'confirmed': return 'Pago confirmado';
      case 'finished': return 'Pago completado';
      case 'failed': return 'Pago fallido';
      case 'expired': return 'Pago expirado';
      default: return 'Procesando...';
    }
  };

  if (!isOpen || !paymentData) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>💳 Completar Pago</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-modal-content">
          {/* Status */}
          <div className="payment-status" style={{ backgroundColor: getStatusColor(paymentStatus) }}>
            <span>{getStatusText(paymentStatus)}</span>
          </div>

          {/* Timer */}
          <div className="payment-timer">
            <span>⏰ Tiempo restante: {formatTime(timeLeft)}</span>
          </div>

          {/* QR Code */}
          <div className="qr-section">
            <h3>Escanea el código QR</h3>
            <div className="qr-container">
              <QRCodeSVG 
                value={paymentData.pay_address || paymentData.payment_url} 
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-details">
            <h3>Detalles del Pago</h3>
            
            <div className="detail-row">
              <span className="label">Monto a pagar:</span>
              <span className="value">
                {paymentData.pay_amount} {paymentData.pay_currency?.toUpperCase()}
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Equivalente en USD:</span>
              <span className="value">${paymentData.price_amount}</span>
            </div>

            <div className="detail-row">
              <span className="label">Red:</span>
              <span className="value">Solana Network</span>
            </div>

            <div className="detail-row">
              <span className="label">Dirección de pago:</span>
              <div className="address-container">
                <span className="address">{paymentData.pay_address}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(paymentData.pay_address)}
                >
                  {copied ? '✅' : '📋'}
                </button>
              </div>
            </div>

            <div className="detail-row">
              <span className="label">ID de Pago:</span>
              <span className="value">{paymentData.payment_id}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="payment-instructions">
            <h3>📋 Instrucciones</h3>
            <ol>
              <li>Abre tu wallet de Solana (Phantom, Solflare, etc.)</li>
              <li>Escanea el código QR o copia la dirección de pago</li>
              <li>Envía exactamente <strong>{paymentData.pay_amount} USDT</strong></li>
              <li>Asegúrate de usar la red de <strong>Solana</strong></li>
              <li>Espera la confirmación (puede tomar unos minutos)</li>
            </ol>
          </div>

          {/* Warning */}
          <div className="payment-warning">
            ⚠️ <strong>Importante:</strong> Envía solo USDT en la red de Solana. 
            Otros tokens o redes resultarán en pérdida de fondos.
          </div>

          {/* Actions */}
          <div className="payment-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button 
              className="btn-primary"
              onClick={() => window.open(paymentData.payment_url, '_blank')}
            >
              Abrir en NOWPayments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;