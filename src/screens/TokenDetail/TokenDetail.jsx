import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heder } from "../../components/Heder";
import tokenService from "../../services/tokenService";
import "./TokenDetail.css";

// Helper function para construir URLs de imágenes
const buildImageUrl = (imageData, tokenName = '') => {
  if (imageData?.data?.attributes?.url) {
    const url = imageData.data.attributes.url;
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  }
  
  const candidateImageMap = {
    'bukele': '/img/bukele.png',
    'gustavo petro': '/img/petro.png',
    'gustavo petro token': '/img/petro.png',
    'barack obama': '/img/obama.png',
    'barack obama coin': '/img/obama.png'
  };
  
  const normalizedName = tokenName.toLowerCase();
  if (candidateImageMap[normalizedName]) {
    return candidateImageMap[normalizedName];
  }
  
  return "/img/image-4.png";
};

export const TokenDetail = () => {
  const { tokenName } = useParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenDetail = async () => {
      try {
        setLoading(true);
        // Buscar token por nombre
        const response = await tokenService.getTokenByName(tokenName);
        
        if (response && response.data && response.data.length > 0) {
          const token = response.data[0];
          const transformedToken = tokenService.transformTokenData(token);
          setTokenData({
            ...transformedToken,
            imagen: buildImageUrl(transformedToken.imagen, transformedToken.nombre)
          });
        } else {
          setError("Token no encontrado");
        }
      } catch (error) {
        console.error("Error fetching token detail:", error);
        setError("Error al cargar los detalles del token");
      } finally {
        setLoading(false);
      }
    };

    if (tokenName) {
      fetchTokenDetail();
    }
  }, [tokenName]);

  if (loading) {
    return (
      <div className="token-detail">
        <Heder />
        <div className="loading-container">
          <div className="loading-message">Cargando detalles del token...</div>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="token-detail">
        <Heder />
        <div className="error-container">
          <div className="error-message">{error || "Token no encontrado"}</div>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Volver al Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="token-detail">
      <Heder />
      
      {/* Header del token */}
      <div className="token-header">
        <div className="token-main-info">
          <img 
            className="token-image-large" 
            src={tokenData.imagen} 
            alt={tokenData.nombre}
            onError={(e) => {
              e.target.src = "/img/image-4.png";
            }}
          />
          <div className="token-title-section">
            <h1 className="token-title">{tokenData.nombre} ({tokenData.symbol})</h1>
            <div className="token-price">
              ${tokenData.precio?.toFixed(2) || "399.69"} 
              <span className="price-change">-4.48%</span>
            </div>
            <p className="token-description">
              {tokenData.descripcion || `${tokenData.nombre} es un token innovador en el ecosistema de criptomonedas, diseñado para ofrecer valor y utilidad a su comunidad. Con características únicas y un enfoque en la descentralización, este token representa una oportunidad de inversión en el futuro de las finanzas digitales.`}
            </p>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="action-buttons">
          <button className="action-btn trade-sol">🔄 Trade with SOL</button>
          <button className="action-btn trade-swar">💱 Trade with $WAR</button>
          <button className="action-btn add-liquidity">💧 Add liquidity</button>
          <button className="action-btn verify">✅ Verify</button>
        </div>
      </div>

      {/* Grid de datos del token */}
      <div className="token-data-grid">
        {/* Market data */}
        <div className="data-section">
          <h3 className="section-title">Market data (24h)</h3>
          <div className="data-items">
            <div className="data-item">
              <span className="data-label">Price</span>
              <span className="data-value">${tokenData.precio?.toFixed(2) || "399.69"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Volume</span>
              <span className="data-value">${tokenData.volumen24h?.toLocaleString() || "4.65K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Mcap</span>
              <span className="data-value">${tokenData.marketCap?.toLocaleString() || "2.00M"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Swaps</span>
              <span className="data-value">{tokenData.swaps || "187"}</span>
            </div>
          </div>
        </div>

        {/* Supply data */}
        <div className="data-section">
          <h3 className="section-title">Supply data</h3>
          <div className="data-items">
            <div className="data-item">
              <span className="data-label">Max Supply</span>
              <span className="data-value">{tokenData.maxSupply?.toLocaleString() || "5.00K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Tokens in swap</span>
              <span className="data-value">{tokenData.tokensEnSwap || "146.621309062879"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Holders</span>
              <span className="data-value">{tokenData.holders || "3.51K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Tokens with holders</span>
              <span className="data-value">{tokenData.tokensConHolders || "4.85K"}</span>
            </div>
          </div>
        </div>

        {/* Liquidity data */}
        <div className="data-section">
          <h3 className="section-title">Liquidity data</h3>
          <div className="data-items">
            <div className="data-item">
              <span className="data-label">SOL in Liquidity</span>
              <span className="data-value">${tokenData.solEnLiquidez || "58.68K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Number of {tokenData.symbol} in SOL pool</span>
              <span className="data-value">{tokenData.tokenEnPoolSol || "74.045"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">WAR in Liquidity</span>
              <span className="data-value">${tokenData.warEnLiquidez || "57.44K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Number of {tokenData.symbol} in WAR pool</span>
              <span className="data-value">{tokenData.tokenEnPoolWar || "72.577"}</span>
            </div>
          </div>
        </div>

        {/* Coin Burn */}
        <div className="data-section">
          <h3 className="section-title">Coin Burn</h3>
          <div className="data-items">
            <div className="data-item">
              <span className="data-label">Locked</span>
              <span className="data-value">{tokenData.bloqueados || "193.314218454"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Value</span>
              <span className="data-value">${tokenData.valorBloqueados || "77.27K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">% of supply</span>
              <span className="data-value">{tokenData.porcentajeBloqueados || "3.86632%"}</span>
            </div>
          </div>
        </div>

        {/* Lock data */}
        <div className="data-section">
          <h3 className="section-title">Lock data</h3>
          <div className="data-items">
            <div className="data-item">
              <span className="data-label">Locked</span>
              <span className="data-value">{tokenData.locked || "3.06K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Value</span>
              <span className="data-value">${tokenData.valorLocked || "1.22M"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">% of supply</span>
              <span className="data-value">{tokenData.porcentajeLocked || "61.21544%"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Users</span>
              <span className="data-value">{tokenData.usuariosLocked || "1.02K"}</span>
            </div>
          </div>
        </div>

        {/* Fee data */}
        <div className="data-section">
          <h3 className="section-title">Fee data</h3>
          <div className="data-items">
            <div className="fee-tabs">
              <span className="fee-tab active">{tokenData.symbol}-SOL</span>
              <span className="fee-tab">{tokenData.symbol}-$WAR</span>
            </div>
            <div className="data-item">
              <span className="data-label">TVL</span>
              <span className="data-value">${tokenData.tvl || "3.55K"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Vol (24h)</span>
              <span className="data-value">${tokenData.vol24h || "85.84"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">365d Yield / TVL</span>
              <span className="data-value">{tokenData.yield365d || "+8.93%"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para volver */}
      <div className="back-section">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al Home
        </button>
      </div>
    </div>
  );
};