import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heder } from '../../components/Heder';
import tokenService from '../../services/tokenService';
import './style.css';

export const TokenDetail = () => {
  const { tokenName } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        setLoading(true);
        const response = await tokenService.getTokenByName(tokenName);
        
        if (response && response.data) {
          setToken(response.data);
        } else {
          setError('Token no encontrado');
        }
      } catch (err) {
        console.error('Error fetching token details:', err);
        setError('Error al cargar los detalles del token');
      } finally {
        setLoading(false);
      }
    };

    if (tokenName) {
      fetchTokenDetails();
    }
  }, [tokenName]);

  const handleBackToTokens = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="token-detail">
        <Heder />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando detalles del token...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="token-detail">
        <Heder />
        <div className="error-container">
          <h2>Token no encontrado</h2>
          <p>{error || 'El token solicitado no existe'}</p>
          <button onClick={handleBackToTokens} className="back-button">
            Volver a Tokens
          </button>
        </div>
      </div>
    );
  }

  const tokenData = token.attributes || token;

  return (
    <div className="token-detail">
      <Heder />
      
      <div className="token-detail-container">
        <button onClick={handleBackToTokens} className="back-to-tokens">
          ← Back to Tokens
        </button>

        <div className="token-header">
          <div className="token-image-container">
            <img 
              src={tokenData.imagen?.data?.attributes?.url || '/img/token-placeholder.png'} 
              alt={tokenData.nombre}
              className="token-image"
            />
          </div>
          
          <div className="token-info">
            <h1 className="token-name">{tokenData.nombre}</h1>
            <p className="token-symbol">${tokenData.symbol || tokenData.nombre?.substring(0, 3).toUpperCase()}</p>
            <p className="token-description">{tokenData.descripcion}</p>
          </div>
        </div>

        <div className="token-stats">
          <div className="stat-card">
            <h3>Current Price</h3>
            <p className="stat-value">${tokenData.currentPrice || '0.00'}</p>
            <span className="stat-label">Per Token</span>
          </div>

          <div className="stat-card">
            <h3>Market Cap</h3>
            <p className="stat-value">${tokenData.marketCap?.toLocaleString() || '20.00K'}</p>
            <span className="stat-label">Total Value</span>
          </div>

          <div className="stat-card">
            <h3>24h Volume</h3>
            <p className="stat-value">{tokenData.volume24h || '0'}</p>
            <span className="stat-label">Trading Volume</span>
          </div>

          <div className="stat-card">
            <h3>Holders</h3>
            <p className="stat-value">{tokenData.holders || '0'}</p>
            <span className="stat-label">Token Holders</span>
          </div>

          <div className="stat-card">
            <h3>Max Supply</h3>
            <p className="stat-value">{tokenData.maxSupply || '0'}</p>
            <span className="stat-label">Total Supply</span>
          </div>

          <div className="stat-card">
            <h3>Total Votes</h3>
            <p className="stat-value">{tokenData.totalVotes || '0'}</p>
            <span className="stat-label">Community Votes</span>
          </div>
        </div>

        <div className="token-details-section">
          <div className="community-links">
            <h2>Community & Links</h2>
            
            <div className="links-grid">
              {tokenData.website && (
                <a href={tokenData.website} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-icon">🌐</div>
                  <div className="link-info">
                    <h4>Official Website</h4>
                    <p>Join our community</p>
                  </div>
                </a>
              )}

              {tokenData.twitter && (
                <a href={tokenData.twitter} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-icon">🐦</div>
                  <div className="link-info">
                    <h4>Twitter</h4>
                    <p>Follow for updates</p>
                  </div>
                </a>
              )}

              {tokenData.telegram && (
                <a href={tokenData.telegram} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-icon">📱</div>
                  <div className="link-info">
                    <h4>Telegram</h4>
                    <p>Join the chat</p>
                  </div>
                </a>
              )}

              {tokenData.discord && (
                <a href={tokenData.discord} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-icon">💬</div>
                  <div className="link-info">
                    <h4>Discord</h4>
                    <p>Community discussions</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          <div className="token-additional-info">
            <h3>Token Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Network:</span>
                <span className="info-value">{tokenData.red || 'Solana'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value status-${tokenData.estado}`}>
                  {tokenData.estado === 'lanzado' ? 'Launched' : 
                   tokenData.estado === 'proximo' ? 'Coming Soon' : 
                   'In Voting'}
                </span>
              </div>
              {tokenData.fechaLanzamiento && (
                <div className="info-item">
                  <span className="info-label">Launch Date:</span>
                  <span className="info-value">
                    {new Date(tokenData.fechaLanzamiento).toLocaleDateString()}
                  </span>
                </div>
              )}
              {tokenData.mintAddress && (
                <div className="info-item">
                  <span className="info-label">Contract:</span>
                  <span className="info-value contract-address">
                    {tokenData.mintAddress}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stay-connected">
          <p><strong>Stay Connected:</strong> Follow our official channels for the latest updates, news, and community discussions.</p>
        </div>
      </div>
    </div>
  );
};