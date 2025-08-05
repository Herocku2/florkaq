import React, { useState } from 'react';

const PublishStep2PlanSelection = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [selectedPlan, setSelectedPlan] = useState(formData.selectedPlan);

  const plans = [
    {
      id: 'entry',
      name: 'ENTRY LISTING',
      price: 50,
      color: '#00ff88',
      features: [
        'Basic token listing on platform',
        'Token information display',
        'Basic search visibility',
        'Standard listing duration (30 days)',
        'Community access'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 1500,
      features: [
        'Everything from Entry Listing +',
        'Featured listing for 1 week',
        'Social media promotion',
        'Priority in search results',
        'Extended listing duration (90 days)',
        'Basic analytics dashboard',
        'Email marketing inclusion',
        'Community spotlight',
        'Basic technical support',
        'Token verification badge'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Listing',
      price: 3000,
      features: [
        'Everything from Basic Listing +',
        'Featured listing for 2 weeks',
        'Advanced social media campaign',
        'Influencer outreach program',
        'Premium placement on homepage',
        'Advanced analytics and insights',
        'Newsletter feature inclusion',
        'Community AMA session',
        'Priority customer support',
        'Custom listing page design',
        'Partnership opportunities'
      ]
    },
    {
      id: 'complete',
      name: 'Premium Listing',
      price: 5000,
      features: [
        'Everything from Standard Listing +',
        'Featured listing for 1 month',
        'Comprehensive marketing campaign',
        'Major influencer partnerships',
        'Banner placement on all pages',
        'Complete analytics suite',
        'Dedicated account manager',
        'Multiple AMA sessions',
        '24/7 priority support',
        'Custom branding integration',
        'Exchange listing assistance',
        'Press release distribution',
        'Strategic partnership facilitation'
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
          💎 Select Your Listing Plan
        </h2>
        
        <div className="plans-info" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '30px',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <strong>Available plans: 4</strong><br />
          Choose the listing plan that best fits your token's marketing needs and budget.
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
                  ENTRY LISTING
                </div>
              )}
              
              <div className="plan-header" style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  color: plan.color || '#ff01a1', 
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

export default PublishStep2PlanSelection;