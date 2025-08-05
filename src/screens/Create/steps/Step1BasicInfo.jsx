import React, { useState } from 'react';

const Step1BasicInfo = ({ formData, updateFormData, nextStep }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, tokenImage: 'Please select a valid image' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, tokenImage: 'Image must be smaller than 5MB' }));
        return;
      }
      
      updateFormData({ tokenImage: file });
      setErrors(prev => ({ ...prev, tokenImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Token name is required';
    }
    
    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Token symbol is required';
    } else if (formData.tokenSymbol.length < 2 || formData.tokenSymbol.length > 10) {
      newErrors.tokenSymbol = 'Symbol must be between 2 and 10 characters';
    }
    
    if (!formData.ownerWallet.trim()) {
      newErrors.ownerWallet = 'Owner wallet is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.telegramUsername = 'Telegram username is required';
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
          📝 Basic Token Information
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Token Name</label>
            <input
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="e.g: Florka Token"
              className={`form-input ${errors.tokenName ? 'error' : ''}`}
            />
            {errors.tokenName && <span className="error-text">{errors.tokenName}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label required">Token Symbol</label>
            <input
              type="text"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleInputChange}
              placeholder="e.g: FLK"
              maxLength={10}
              className={`form-input ${errors.tokenSymbol ? 'error' : ''}`}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.tokenSymbol && <span className="error-text">{errors.tokenSymbol}</span>}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Token Description</label>
          <textarea
            name="tokenDescription"
            value={formData.tokenDescription}
            onChange={handleInputChange}
            placeholder="Describe your token project..."
            className="form-textarea"
            rows={4}
          />
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Token Image</label>
          <div className={`image-upload ${formData.tokenImage ? 'has-image' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="tokenImage"
            />
            <label htmlFor="tokenImage" style={{ cursor: 'pointer', width: '100%' }}>
              {formData.tokenImage ? (
                <div>
                  <div className="upload-icon">✅</div>
                  <div className="upload-text">
                    Selected image: {formData.tokenImage.name}
                  </div>
                  <div className="upload-button">Change Image</div>
                </div>
              ) : (
                <div>
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    Drag and drop an image or GIF
                  </div>
                  <div className="upload-button">Select file</div>
                </div>
              )}
            </label>
          </div>
          {errors.tokenImage && <span className="error-text">{errors.tokenImage}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h2 className="section-title">
          ⚠️ Required Information
        </h2>
        
        <div className="form-group full-width">
          <label className="form-label required">Owner Wallet</label>
          <input
            type="text"
            name="ownerWallet"
            value={formData.ownerWallet}
            onChange={handleInputChange}
            placeholder="Your Solana wallet address where tokens will be sent"
            className={`form-input ${errors.ownerWallet ? 'error' : ''}`}
          />
          {errors.ownerWallet && <span className="error-text">{errors.ownerWallet}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Blockchain Network</label>
            <select
              name="blockchainNetwork"
              value={formData.blockchainNetwork}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="solana">Solana (SOL)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="binance">Binance Smart Chain (BNB)</option>
              <option value="polygon">Polygon (MATIC)</option>
              <option value="avalanche">Avalanche (AVAX)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label required">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`form-input ${errors.contactEmail ? 'error' : ''}`}
            />
            {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label required">Telegram Username</label>
          <input
            type="text"
            name="telegramUsername"
            value={formData.telegramUsername}
            onChange={handleInputChange}
            placeholder="@yourusername"
            className={`form-input ${errors.telegramUsername ? 'error' : ''}`}
          />
          {errors.telegramUsername && <span className="error-text">{errors.telegramUsername}</span>}
        </div>
      </div>
      
      <div className="form-note">
        <p style={{ color: '#fbbf24', fontSize: '0.9rem', fontStyle: 'italic' }}>
          Note: Token data cannot be changed after creation
        </p>
      </div>
      
      <div className="step-navigation">
        <div></div> {/* Empty div for spacing */}
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

export default Step1BasicInfo;