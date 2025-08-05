import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PublishStep1TokenInfo from './steps/PublishStep1TokenInfo';
import PublishStep2PlanSelection from './steps/PublishStep2PlanSelection';
import PublishStep3Payment from './steps/PublishStep3Payment';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import LaunchCalendar from '../../components/LaunchCalendar/LaunchCalendar';
import './PublishWizard.css';

const PublishWizard = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Token Info
    tokenName: '',
    tokenSymbol: '',
    tokenType: 'ERC-20',
    totalSupply: '',
    initialCirculation: '',
    decimals: '18',
    tokenDescription: '',
    tokenImage: null,
    contractAddress: '',
    blockExplorerUrl: '',
    
    // Step 2 - Plan Selection
    selectedPlan: null,
    
    // Step 3 - Payment
    paymentHash: '',
    paymentStatus: 'pending',
    paymentId: '',
    paymentUrl: ''
  });

  const [paymentModal, setPaymentModal] = useState({ isOpen: false, data: null });
  const [calendarModal, setCalendarModal] = useState({ isOpen: false, tokenRequestId: null });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Manejar confirmación de pago
  const handlePaymentConfirmed = async (paymentStatus) => {
    console.log('✅ Pago confirmado para listing:', paymentStatus);
    setPaymentModal({ isOpen: false, data: null });
    
    // Aquí se crearía la solicitud de listing en el backend
    alert(`¡Token listing solicitado exitosamente! 🎉

Token: ${formData.tokenName} (${formData.tokenSymbol})
Plan: ${formData.selectedPlan?.name}
Hash de Pago: ${formData.paymentHash}

Tu token será listado después de la revisión del equipo.`);
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="publish-wizard">
        <div className="wizard-container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>You need to be logged in to publish a token listing.</p>
            <a href="/auth" className="auth-link">
              Login / Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publish-wizard">
      <div className="wizard-container">
        <h1 className="wizard-title">PUBLISH TOKEN LISTING</h1>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            1
          </div>
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            2
          </div>
          <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
            3
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {currentStep === 1 && (
            <PublishStep1TokenInfo
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              user={user}
            />
          )}
          
          {currentStep === 2 && (
            <PublishStep2PlanSelection
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <PublishStep3Payment
              formData={formData}
              updateFormData={updateFormData}
              prevStep={prevStep}
              user={user}
              setPaymentModal={setPaymentModal}
            />
          )}
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, data: null })}
          paymentData={paymentModal.data}
          onPaymentConfirmed={handlePaymentConfirmed}
        />

        {/* Calendar Modal */}
        <LaunchCalendar
          isOpen={calendarModal.isOpen}
          onClose={() => setCalendarModal({ isOpen: false, tokenRequestId: null })}
          onDateSelected={() => {}}
          tokenRequestId={calendarModal.tokenRequestId}
        />
      </div>
    </div>
  );
};

export default PublishWizard;