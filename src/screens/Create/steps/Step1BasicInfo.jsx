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
        setErrors(prev => ({ ...prev, tokenImage: 'Por favor selecciona una imagen válida' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, tokenImage: 'La imagen debe ser menor a 5MB' }));
        return;
      }
      
      updateFormData({ tokenImage: file });
      setErrors(prev => ({ ...prev, tokenImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'El nombre del token es obligatorio';
    }
    
    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'El símbolo del token es obligatorio';
    } else if (formData.tokenSymbol.length < 2 || formData.tokenSymbol.length > 10) {
      newErrors.tokenSymbol = 'El símbolo debe tener entre 2 y 10 caracteres';
    }
    
    if (!formData.ownerWallet.trim()) {
      newErrors.ownerWallet = 'La wallet del propietario es obligatoria';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email de contacto es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Por favor ingresa un email válido';
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.telegramUsername = 'El usuario de Telegram es obligatorio';
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
          📝 Información Básica del Token
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Nombre del Token</label>
            <input
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="Ej: Florka Token"
              className={`form-input ${errors.tokenName ? 'error' : ''}`}
            />
            {errors.tokenName && <span className="error-text">{errors.tokenName}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label required">Símbolo del Token</label>
            <input
              type="text"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleInputChange}
              placeholder="Ej: FLK"
              maxLength={10}
              className={`form-input ${errors.tokenSymbol ? 'error' : ''}`}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.tokenSymbol && <span className="error-text">{errors.tokenSymbol}</span>}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Descripción del Token</label>
          <textarea
            name="tokenDescription"
            value={formData.tokenDescription}
            onChange={handleInputChange}
            placeholder="Describe tu proyecto de token..."
            className="form-textarea"
            rows={4}
          />
        </div>
        
        <div className="form-group full-width">
          <label className="form-label">Imagen del Token</label>
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
                    Imagen seleccionada: {formData.tokenImage.name}
                  </div>
                  <div className="upload-button">Cambiar Imagen</div>
                </div>
              ) : (
                <div>
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    Arrastra y suelta una imagen o GIF
                  </div>
                  <div className="upload-button">Seleccionar archivo</div>
                </div>
              )}
            </label>
          </div>
          {errors.tokenImage && <span className="error-text">{errors.tokenImage}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h2 className="section-title">
          ⚠️ Información Requerida
        </h2>
        
        <div className="form-group full-width">
          <label className="form-label required">Wallet del Propietario</label>
          <input
            type="text"
            name="ownerWallet"
            value={formData.ownerWallet}
            onChange={handleInputChange}
            placeholder="Tu dirección de wallet de Solana donde se enviarán los tokens"
            className={`form-input ${errors.ownerWallet ? 'error' : ''}`}
          />
          {errors.ownerWallet && <span className="error-text">{errors.ownerWallet}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Red Blockchain</label>
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
            <label className="form-label required">Email de Contacto</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="tu.email@ejemplo.com"
              className={`form-input ${errors.contactEmail ? 'error' : ''}`}
            />
            {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label required">Usuario de Telegram</label>
          <input
            type="text"
            name="telegramUsername"
            value={formData.telegramUsername}
            onChange={handleInputChange}
            placeholder="@tuusuario"
            className={`form-input ${errors.telegramUsername ? 'error' : ''}`}
          />
          {errors.telegramUsername && <span className="error-text">{errors.telegramUsername}</span>}
        </div>
      </div>
      
      <div className="form-note">
        <p style={{ color: '#fbbf24', fontSize: '0.9rem', fontStyle: 'italic' }}>
          Nota: Los datos del token no se pueden cambiar después de la creación
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