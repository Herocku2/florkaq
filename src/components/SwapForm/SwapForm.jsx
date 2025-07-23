import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import swapService from '../../services/swapService';
import './style.css';

export const SwapForm = () => {
  const { isAuthenticated, user } = useAuth();
  const [availableTokens, setAvailableTokens] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [swapHistory, setSwapHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Cargar tokens disponibles
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const response = await swapService.getAvailableTokens();

        if (response && response.data) {
          setAvailableTokens(response.data);

          // Seleccionar los primeros dos tokens por defecto
          if (response.data.length >= 2) {
            setFromToken(response.data[0]);
            setToToken(response.data[1]);
          }
        }
      } catch (err) {
        console.error("Error fetching available tokens:", err);
        setError("No se pudieron cargar los tokens disponibles. Usando datos de ejemplo.");

        // Usar datos de ejemplo si falla
        const fallbackTokens = [
          {
            id: 1,
            attributes: {
              nombre: "Solana",
              symbol: "SOL",
              imagen: { data: { attributes: { url: "/img/solana-logo.png" } } }
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Florkafun",
              symbol: "FLK",
              imagen: { data: { attributes: { url: "/img/image-1.png" } } }
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Bukele Coin",
              symbol: "BUK",
              imagen: { data: { attributes: { url: "/img/image-3.png" } } }
            }
          }
        ];

        setAvailableTokens(fallbackTokens);
        setFromToken(fallbackTokens[0]);
        setToToken(fallbackTokens[1]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Cargar historial de swaps del usuario
  useEffect(() => {
    const fetchSwapHistory = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await swapService.getUserSwapHistory(user.id);

        if (response && response.data) {
          setSwapHistory(response.data);
        }
      } catch (err) {
        console.error("Error fetching swap history:", err);
      }
    };

    if (isAuthenticated) {
      fetchSwapHistory();
    }
  }, [isAuthenticated, user, success]);

  // Calcular cantidad de salida cuando cambia la cantidad de entrada
  useEffect(() => {
    const calculateOutput = async () => {
      if (!fromToken || !toToken || !fromAmount || fromAmount <= 0) {
        setToAmount('');
        return;
      }

      try {
        setCalculating(true);

        // Obtener precios de los tokens
        const fromPrice = await swapService.getTokenPrice(fromToken.id);
        const toPrice = await swapService.getTokenPrice(toToken.id);

        // Calcular cantidad de salida
        const result = swapService.calculateSwapAmount(
          parseFloat(fromAmount),
          fromPrice.price,
          toPrice.price
        );

        setToAmount(result.toAmount.toFixed(6));
      } catch (err) {
        console.error("Error calculating swap amount:", err);
        setError("Error al calcular la cantidad de salida.");
      } finally {
        setCalculating(false);
      }
    };

    calculateOutput();
  }, [fromToken, toToken, fromAmount]);

  // Manejar cambio de token de origen
  const handleFromTokenChange = (e) => {
    const tokenId = parseInt(e.target.value);
    const selectedToken = availableTokens.find(token => token.id === tokenId);

    if (selectedToken) {
      // Evitar seleccionar el mismo token para origen y destino
      if (toToken && selectedToken.id === toToken.id) {
        // Intercambiar tokens
        setFromToken(toToken);
        setToToken(selectedToken);
      } else {
        setFromToken(selectedToken);
      }
    }
  };

  // Manejar cambio de token de destino
  const handleToTokenChange = (e) => {
    const tokenId = parseInt(e.target.value);
    const selectedToken = availableTokens.find(token => token.id === tokenId);

    if (selectedToken) {
      // Evitar seleccionar el mismo token para origen y destino
      if (fromToken && selectedToken.id === fromToken.id) {
        // Intercambiar tokens
        setToToken(fromToken);
        setFromToken(selectedToken);
      } else {
        setToToken(selectedToken);
      }
    }
  };

  // Manejar cambio de cantidad de origen
  const handleFromAmountChange = (e) => {
    const value = e.target.value;

    // Validar que sea un número positivo
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setFromAmount(value);
    }
  };

  // Intercambiar tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);

    // Recalcular cantidades
    if (toAmount) {
      setFromAmount(toAmount);
      setToAmount('');
    }
  };

  // Ejecutar swap
  const handleExecuteSwap = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para realizar un swap.");
      return;
    }

    if (!fromToken || !toToken || !fromAmount || !toAmount) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setSwapping(true);
      setError(null);
      setSuccess(null);

      const result = await swapService.executeSwap(
        fromToken.id,
        toToken.id,
        parseFloat(fromAmount),
        parseFloat(toAmount),
        user.id
      );

      if (result.success) {
        setSuccess(`¡Swap completado con éxito! ID de transacción: ${result.transactionId}`);
        setFromAmount('');
        setToAmount('');
      } else {
        throw new Error("Error al ejecutar el swap.");
      }
    } catch (err) {
      console.error("Error executing swap:", err);
      setError("Error al ejecutar el swap. Por favor, inténtalo de nuevo.");
    } finally {
      setSwapping(false);
    }
  };

  // Obtener URL de imagen del token
  const getTokenImageUrl = (token) => {
    if (!token) return "/img/token-placeholder.png";

    const imageUrl = token.attributes.imagen?.data?.attributes?.url;
    return imageUrl ? `http://localhost:1337${imageUrl}` : "/img/token-placeholder.png";
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="swap-form-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tokens disponibles...</p>
        </div>
      ) : (
        <>
          <div className="swap-form">
            <h2>Swap de Tokens</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="swap-inputs">
              <div className="swap-input-group">
                <label>De:</label>
                <div className="token-select-container">
                  <select
                    value={fromToken?.id || ''}
                    onChange={handleFromTokenChange}
                    disabled={swapping}
                  >
                    {availableTokens.map(token => (
                      <option key={token.id} value={token.id}>
                        {token.attributes.nombre} ({token.attributes.symbol})
                      </option>
                    ))}
                  </select>
                  {fromToken && (
                    <img
                      src={getTokenImageUrl(fromToken)}
                      alt={fromToken.attributes.nombre}
                      className="token-icon"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.0"
                  disabled={swapping}
                />
              </div>

              <button
                className="swap-direction-button"
                onClick={handleSwapTokens}
                disabled={swapping}
              >
                ↑↓
              </button>

              <div className="swap-input-group">
                <label>A:</label>
                <div className="token-select-container">
                  <select
                    value={toToken?.id || ''}
                    onChange={handleToTokenChange}
                    disabled={swapping}
                  >
                    {availableTokens.map(token => (
                      <option key={token.id} value={token.id}>
                        {token.attributes.nombre} ({token.attributes.symbol})
                      </option>
                    ))}
                  </select>
                  {toToken && (
                    <img
                      src={getTokenImageUrl(toToken)}
                      alt={toToken.attributes.nombre}
                      className="token-icon"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={calculating ? 'Calculando...' : toAmount}
                  readOnly
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="swap-details">
              {fromAmount && toAmount && (
                <div className="rate-info">
                  <span>Tasa de cambio:</span>
                  <span>1 {fromToken?.attributes.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken?.attributes.symbol}</span>
                </div>
              )}
              <div className="fee-info">
                <span>Comisión:</span>
                <span>1%</span>
              </div>
            </div>

            <button
              className="swap-button"
              onClick={handleExecuteSwap}
              disabled={!fromAmount || !toAmount || swapping || !isAuthenticated}
            >
              {swapping ? 'Procesando...' : isAuthenticated ? 'Realizar Swap' : 'Inicia sesión para hacer Swap'}
            </button>
          </div>

          {isAuthenticated && (
            <div className="swap-history-section">
              <button
                className="history-toggle-button"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Ocultar historial' : 'Mostrar historial de swaps'}
              </button>

              {showHistory && (
                <div className="swap-history">
                  <h3>Historial de Swaps</h3>

                  {swapHistory.length === 0 ? (
                    <p className="no-history">No hay transacciones en tu historial.</p>
                  ) : (
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>De</th>
                          <th>Cantidad</th>
                          <th>A</th>
                          <th>Cantidad</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {swapHistory.map(swap => (
                          <tr key={swap.id}>
                            <td>{formatDate(swap.attributes.createdAt)}</td>
                            <td>{swap.attributes.tokenOrigen?.data?.attributes?.symbol || 'N/A'}</td>
                            <td>{swap.attributes.cantidadOrigen}</td>
                            <td>{swap.attributes.tokenDestino?.data?.attributes?.symbol || 'N/A'}</td>
                            <td>{swap.attributes.cantidadDestino}</td>
                            <td>
                              <span className={`status-${swap.attributes.estado}`}>
                                {swap.attributes.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SwapForm;