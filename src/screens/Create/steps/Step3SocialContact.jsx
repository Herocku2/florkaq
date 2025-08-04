import React, { useState } from 'react';

const Step3SocialContact = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields from previous steps (should already be filled)
    if (!formData.ownerWallet.trim()) {
      newErrors.ownerWallet = 'La wallet del propietario es obligatoria';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email del peticionario es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Por favor ingresa un email válido';
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.telegramUsername = 'El Telegram del peticionario es obligatorio';
    }
    
    if (!formData.blockchainNetwork) {
      newErrors.blockchainNetwork = 'Debes seleccionar una red blockchain';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="step-form">
      <div className="form-section">
        <h2 className="section-title">
          📋 Información del Peticionario
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Wallet del Propietario del Token</label>
            <input
              type="text"
              name="ownerWallet"
              value={formData.ownerWallet}
              onChange={handleInputChange}
              className={`form-input ${errors.ownerWallet ? 'error' : ''}`}
              readOnly
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            />
            {errors.ownerWallet && <span className="error-text">{errors.ownerWallet}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label required">Email del Peticionario</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className={`form-input ${errors.contactEmail ? 'error' : ''}`}
              readOnly
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            />
            {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Telegram del Peticionario</label>
            <input
              type="text"
              name="telegramUsername"
              value={formData.telegramUsername}
              onChange={handleInputChange}
              className={`form-input ${errors.telegramUsername ? 'error' : ''}`}
              readOnly
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            />
            {errors.telegramUsername && <span className="error-text">{errors.telegramUsername}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label required">Red Blockchain</label>
            <select
              name="blockchainNetwork"
              value={formData.blockchainNetwork}
              onChange={handleInputChange}
              className={`form-select ${errors.blockchainNetwork ? 'error' : ''}`}
            >
              <option value="">Seleccionar Red</option>
              <option value="solana">Solana (SOL)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="binance">Binance Smart Chain (BNB)</option>
              <option value="polygon">Polygon (MATIC)</option>
              <option value="avalanche">Avalanche (AVAX)</option>
            </select>
            {errors.blockchainNetwork && <span className="error-text">{errors.blockchainNetwork}</span>}
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h2 className="section-title">
          🌐 Redes Sociales del Proyecto
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Twitter</label>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Official link
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                placeholder="https://twitter.com/..."
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Telegram</label>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Official group link
              </label>
              <input
                type="url"
                name="telegramGroupUrl"
                value={formData.telegramGroupUrl}
                onChange={handleInputChange}
                placeholder="https://t.me/..."
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/..."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Discord</label>
            <input
              type="url"
              name="discordUrl"
              value={formData.discordUrl}
              onChange={handleInputChange}
              placeholder="https://discord.gg/..."
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              placeholder="https://..."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Support Channel</label>
            <input
              type="url"
              name="supportChannelUrl"
              value={formData.supportChannelUrl}
              onChange={handleInputChange}
              placeholder="https://t.me/..."
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Social Channel Description</label>
          <textarea
            name="socialChannelDescription"
            value={formData.socialChannelDescription}
            onChange={handleInputChange}
            placeholder="Describe los canales sociales de tu proyecto..."
            className="form-textarea"
            rows={4}
          />
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
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3SocialContact;