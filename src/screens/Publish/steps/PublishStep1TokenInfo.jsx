import React, { useState } from 'react';

const PublishStep1TokenInfo = ({ formData, updateFormData, nextStep, user }) => {
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
    
    if (!formData.totalSupply.trim()) {
      newErrors.totalSupply = 'Total supply is required';
    } else if (isNaN(formData.totalSupply) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Total supply must be a positive number';
    }
    
    if (!formData.contractAddress.trim()) {
      newErrors.contractAddress = 'Contract address is required';
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
          📝 Token Information
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Token Name</label>
            <input
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="e.g: My Awesome Token"
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
              placeholder="e.g: MAT"
              maxLength={10}
              className={`form-input ${errors.tokenSymbol ? 'error' : ''}`}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.tokenSymbol && <span className="error-text">{errors.tokenSymbol}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Token Type</label>
            <select
              name="tokenType"
              value={formData.tokenType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="ERC-20">ERC-20 (Ethereum)</option>
              <option value="BEP-20">BEP-20 (BSC)</option>
              <option value="SPL">SPL (Solana)</option>
              <option value="ERC-721">ERC-721 (NFT)</option>
              <option value="ERC-1155">ERC-1155 (Multi-Token)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label required">Total Supply</label>
            <input
              type="text"
              name="totalSupply"
              value={formData.totalSupply}
              onChange={handleInputChange}
              placeholder="e.g: 1000000"
              className={`form-input ${errors.totalSupply ? 'error' : ''}`}
            />
            {errors.totalSupply && <span className="error-text">{errors.totalSupply}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Initial Circulation</label>
            <input
              type="text"
              name="initialCirculation"
              value={formData.initialCirculation}
              onChange={handleInputChange}
              placeholder="e.g: 500000"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Token Decimals</label>
            <input
              type="number"
              name="decimals"
              value={formData.decimals}
              onChange={handleInputChange}
              placeholder="18"
              min="0"
              max="18"
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <label className="form-label required">Contract Address</label>
          <input
            type="text"
            name="contractAddress"
            value={formData.contractAddress}
            onChange={handleInputChange}
            placeholder="0x... or contract address on your blockchain"
            className={`form-input ${errors.contractAddress ? 'error' : ''}`}
          />
          {errors.contractAddress && <span className="error-text">{errors.contractAddress}</span>}
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Block Explorer URL</label>
          <input
            type="url"
            name="blockExplorerUrl"
            value={formData.blockExplorerUrl}
            onChange={handleInputChange}
            placeholder="https://etherscan.io/token/0x..."
            className="form-input"
          />
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Token Logo</label>
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
                    Drag and drop your token logo or click to select
                  </div>
                  <div className="upload-button">Select Image</div>
                </div>
              )}
            </label>
          </div>
          {errors.tokenImage && <span className="error-text">{errors.tokenImage}</span>}
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Token Description</label>
          <textarea
            name="tokenDescription"
            value={formData.tokenDescription}
            onChange={handleInputChange}
            placeholder="Describe your token project and its utility..."
            className="form-textarea"
            rows={4}
          />
        </div>
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

export default PublishStep1TokenInfo;