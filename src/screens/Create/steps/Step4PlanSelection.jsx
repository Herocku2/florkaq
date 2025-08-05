import React, { useState } from 'react';

const Step4PlanSelection = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [selectedPlan, setSelectedPlan] = useState(formData.selectedPlan);

  const plans = [
    {
      id: 'entry',
      name: 'ENTRY PLAN',
      price: 50,
      color: '#00ff88',
      features: [
        'Functional basic token',
        'Initial liquidity configuration',
        'Basic liquidity configuration',
        'Starting configuration',
        'Initial staking for holders'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 1500,
      features: [
        'Create a unique token on the selected network',
        'Configurable initial supply for project launch',
        'Platform listing for 1 week of spotlight',
        'Social media integration for the token',
        'Basic transfer and management functionalities',
        'Basic technical support during setup',
        'Standard token documentation',
        'Compatible with main blockchain network wallets',
        'Token based on X (selected blockchain)',
        'Basic user manual'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 3000,
      features: [
        'Everything from Basic Plan +',
        'Advanced token management functionalities',
        'Integration with more exchanges and DeFi platforms',
        'Basic security audit of smart contract',
        'Initial liquidity pool configuration',
        'Initial social media marketing for 2 weeks',
        'Priority listing on partner exchanges',
        'Extended technical support for 30 days',
        'Personalized dashboard for token metrics',
        'Basic staking configuration (optional)',
        'Personalized technical documentation'
      ]
    },
    {
      id: 'complete',
      name: 'Complete Plan',
      price: 5000,
      features: [
        'Everything from Standard Plan +',
        'Complete security audit by certified auditors',
        'Aggressive marketing for 1 month on multiple channels',
        'Guaranteed listing on major exchanges',
        'Advanced tokenomics and distribution configuration',
        'Integrated governance system for token holders',
        'Basic dApps development for the token ecosystem',
        'Strategic consulting for long-term growth',
        'Partnership with blockchain sector influencers',
        'Complete documentation and professional whitepapers',
        'Advanced staking and farming configuration (yield farming, etc.)',
        'Complete white-label analysis and positioning strategy'
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    updateFormData({ selectedPlan: plan });
  };

  const handleNext = () => {
    if (selectedPlan) {
      nextStep();
    }
  };

  return (
    <div className="step-form">
      <div className="form-section">
        <h2 className="section-title">
          💎 Select Your Plan
        </h2>
        
        <div className="wallet-connection" style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '20px', 
          borderRadius: '12px', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ff6b9d', marginBottom: '15px' }}>
            Connect Your Solana Wallet
          </h3>
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
        
        <div className="plans-info" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '30px',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <strong>Total plans: 4</strong><br />
          Plans: ENTRY PLAN ($50), Basic Plan ($1500), Standard Plan ($3000), Complete Plan ($5000)
        </div>
        
        <div className="plans-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanSelect(plan)}
              style={{
                background: selectedPlan?.id === plan.id 
                  ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))'
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedPlan?.id === plan.id 
                  ? `2px solid ${plan.color || '#00ff88'}`
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {plan.id === 'entry' && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: '#00ff88',
                  color: 'black',
                  padding: '5px 15px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  ENTRY PLAN
                </div>
              )}
              
              <div className="plan-header" style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  color: plan.color || '#ff6b9d', 
                  margin: '0 0 10px 0',
                  fontSize: '1.3rem'
                }}>
                  {plan.name}
                </h3>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  ${plan.price} USD
                </div>
              </div>
              
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '10px',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: plan.color || '#00ff88', minWidth: '15px' }}>•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          onClick={handleNext}
          disabled={!selectedPlan}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4PlanSelection;