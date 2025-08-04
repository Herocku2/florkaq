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
          Esta información es opcional. Si no tienes estos datos, puedes dejarlos en blanco.
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
                placeholder="Ejemplo: 40% public sale, 30% team..."
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">¿En qué red quieres alojar tu proyecto?</label>
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
            <label className="form-label">¿Cuántos tokens serán para el equipo de desarrollo?</label>
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
            <label className="form-label">¿Tienes algún Smart Contract escrito?</label>
            <textarea
              name="smartContract"
              value={formData.smartContract}
              onChange={handleInputChange}
              placeholder="Sí/No, detalles..."
              className="form-textarea"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Porcentaje de Marketing</label>
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
            <label className="form-label">¿Cuánto tiempo durará la venta inicial?</label>
            <input
              type="text"
              name="initialSaleDuration"
              value={formData.initialSaleDuration}
              onChange={handleInputChange}
              placeholder="30 días, 60 días, etc."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Porcentaje de Socios e Inversores</label>
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