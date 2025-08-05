import React from 'react';

const Step2MarketData = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="step-form">
      <div className="form-section">
        <h2 className="section-title">
          📊 Market Data
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
          This information is optional. If you don't have this data, you can leave it blank.
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Token Producer</label>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Block Explorer
              </label>
              <input
                type="url"
                name="blockExplorer"
                value={formData.blockExplorer}
                onChange={handleInputChange}
                placeholder="https://"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Token Distribution</label>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Token Distribution Percentage
              </label>
              <input
                type="text"
                name="tokenDistributionPercentage"
                value={formData.tokenDistributionPercentage}
                onChange={handleInputChange}
                placeholder="Example: 40% public sale, 30% team..."
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Which network do you want to host your project on?</label>
            <input
              type="text"
              name="networkToHost"
              value={formData.networkToHost}
              onChange={handleInputChange}
              placeholder="Ethereum, Binance Smart Chain, etc."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">How many tokens will be for the development team?</label>
            <input
              type="text"
              name="developmentTeamPercentage"
              value={formData.developmentTeamPercentage}
              onChange={handleInputChange}
              placeholder="20%, 30%, etc."
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Do you have any Smart Contract written?</label>
            <textarea
              name="smartContract"
              value={formData.smartContract}
              onChange={handleInputChange}
              placeholder="Yes/No, details..."
              className="form-textarea"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Marketing Percentage</label>
            <input
              type="text"
              name="marketingPercentage"
              value={formData.marketingPercentage}
              onChange={handleInputChange}
              placeholder="10%, 15%, etc."
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">How long will the initial sale last?</label>
            <input
              type="text"
              name="initialSaleDuration"
              value={formData.initialSaleDuration}
              onChange={handleInputChange}
              placeholder="30 days, 60 days, etc."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Partners and Investors Percentage</label>
            <input
              type="text"
              name="partnersInvestorsPercentage"
              value={formData.partnersInvestorsPercentage}
              onChange={handleInputChange}
              placeholder="20%, 25%, etc."
              className="form-input"
            />
          </div>
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
          onClick={nextStep}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2MarketData;