import React, { useState } from 'react';
import { Heder } from '../../components/Heder/Heder';
import { useAuth } from '../../contexts/AuthContext';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2MarketData from './steps/Step2MarketData';
import Step3SocialContact from './steps/Step3SocialContact';
import Step4PlanSelection from './steps/Step4PlanSelection';
import Step5PaymentSummary from './steps/Step5PaymentSummary';
import './CreateTokenWizard.css';

export const CreateTokenWizard = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    tokenName: '',
    tokenSymbol: '',
    tokenDescription: '',
    tokenImage: null,
    ownerWallet: '',
    contactEmail: '',
    telegramUsername: '',
    blockchainNetwork: 'solana',
    
    // Paso 2: Market Data (opcional)
    blockExplorer: '',
    networkToHost: '',
    smartContract: '',
    initialSaleDuration: '',
    tokenDistribution: '',
    tokenDistributionPercentage: '',
    developmentTeamPercentage: '',
    marketingPercentage: '',
    partnersInvestorsPercentage: '',
    
    // Paso 3: Redes Sociales
    twitterUrl: '',
    telegramGroupUrl: '',
    linkedinUrl: '',
    discordUrl: '',
    websiteUrl: '',
    supportChannelUrl: '',
    socialChannelDescription: '',
    
    // Paso 4: Plan seleccionado
    selectedPlan: null,
    
    // Paso 5: Información de pago
    paymentHash: '',
    paymentStatus: 'pending'
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2MarketData
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3SocialContact
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Step4PlanSelection
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <Step5PaymentSummary
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-token-wizard">
        <Heder />
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>You must log in to create a token.</p>
          <a href="/auth" className="auth-link">Log In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="create-token-wizard">
      <Heder />
      
      <div className="wizard-container">
        <h1 className="wizard-title">CREATE YOUR TOKEN</h1>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`step-indicator ${
                step === currentStep ? 'active' : step < currentStep ? 'completed' : ''
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <div className="step-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CreateTokenWizard;