import React, { useState, useEffect } from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { useAuth } from "../../contexts/AuthContext";
import packageService from "../../services/packageService";
import "./style.css";

export const Create = () => {
  const { isAuthenticated, user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenFormData, setTokenFormData] = useState({
    nombre: '',
    simbolo: '',
    descripcion: '',
    red: 'solana',
    supply: '1000000000'
  });
  const [paymentStep, setPaymentStep] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Cargar paquetes disponibles
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await packageService.getPackages();
        
        if (response && response.data) {
          const transformedPackages = response.data.map(pkg => 
            packageService.transformPackageData(pkg)
          );
          setPackages(transformedPackages);
          
          // Seleccionar el primer paquete por defecto
          if (transformedPackages.length > 0) {
            setSelectedPackage(transformedPackages[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("No se pudieron cargar los paquetes disponibles. Por favor, inténtelo de nuevo más tarde.");
        
        // Usar datos de ejemplo si falla
        const fallbackPackage = {
          id: 1,
          nombre: "Paquete Básico",
          precio: 150,
          nivel: "básico",
          caracteristicas: [
            "Creación de contrato en red seleccionada (Solana, ETH, BNB, etc.)",
            "200M – 1B de supply (según preferencia).",
            "Pool de liquidez básica ($1.000).",
            "1 AMA ($300).",
            "1-5 Youtubers ($250).",
            "Listado en la plataforma.",
            "1 post del token en X.",
            "Página personalizada."
          ]
        };
        
        setPackages([fallbackPackage]);
        setSelectedPackage(fallbackPackage);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTokenFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de paquete
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para crear un token");
      return;
    }
    
    if (!selectedPackage) {
      setError("Debes seleccionar un paquete");
      return;
    }
    
    // Validar formulario
    if (!tokenFormData.nombre || !tokenFormData.simbolo) {
      setError("El nombre y símbolo del token son obligatorios");
      return;
    }
    
    // Avanzar al paso de pago
    setPaymentStep(true);
    setError(null);
  };

  // Manejar proceso de pago
  const handlePayment = async () => {
    if (!isAuthenticated || !selectedPackage) {
      return;
    }
    
    setProcessingPayment(true);
    setError(null);
    
    try {
      // Simular proceso de pago
      const paymentResult = await packageService.simulatePayment(selectedPackage.precio);
      
      if (paymentResult.success) {
        // Crear solicitud de token
        const tokenRequestData = {
          usuario: user.id,
          paquete: selectedPackage.id,
          datosToken: JSON.stringify(tokenFormData),
          estado: 'pendiente',
          fechaPago: new Date().toISOString(),
          transaccionId: paymentResult.transactionId,
          aprobado: false
        };
        
        const requestResult = await packageService.createTokenRequest(tokenRequestData);
        
        if (requestResult && requestResult.data) {
          setPaymentSuccess(true);
          setRequestSubmitted(true);
        } else {
          throw new Error("Error al crear la solicitud de token");
        }
      } else {
        throw new Error("El pago no pudo ser procesado");
      }
    } catch (err) {
      console.error("Error en el proceso de pago:", err);
      setError("Ocurrió un error durante el proceso de pago. Por favor, inténtelo de nuevo.");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="create">
      <Heder className="heder-home" />

      <div className="titulo-pagina-6">
        <h1 className="create-title">Crea tu propio Token</h1>
      </div>

      <BanerMovil className="baner-movil-5" frame="/img/frame-31-3.svg" />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando paquetes disponibles...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : requestSubmitted ? (
        <div className="success-message">
          <h2>¡Solicitud enviada con éxito!</h2>
          <p>Tu solicitud de token ha sido recibida. Nuestro equipo se pondrá en contacto contigo pronto.</p>
          <p>ID de transacción: {paymentSuccess ? "TX-" + Math.random().toString(36).substring(2, 10).toUpperCase() : "N/A"}</p>
        </div>
      ) : paymentStep ? (
        <div className="payment-container">
          <h2>Resumen de tu solicitud</h2>
          
          <div className="token-summary">
            <div className="summary-item">
              <span className="summary-label">Nombre del Token:</span>
              <span className="summary-value">{tokenFormData.nombre}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Símbolo:</span>
              <span className="summary-value">{tokenFormData.simbolo}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Red:</span>
              <span className="summary-value">{tokenFormData.red}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Supply:</span>
              <span className="summary-value">{tokenFormData.supply}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Paquete:</span>
              <span className="summary-value">{selectedPackage?.nombre}</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total a pagar:</span>
              <span className="summary-value">${selectedPackage?.precio} USDT</span>
            </div>
          </div>
          
          <div className="payment-actions">
            <button 
              className="back-button" 
              onClick={() => setPaymentStep(false)}
              disabled={processingPayment}
            >
              Volver
            </button>
            <button 
              className="pay-button" 
              onClick={handlePayment}
              disabled={processingPayment}
            >
              {processingPayment ? "Procesando..." : "Realizar Pago"}
            </button>
          </div>
        </div>
      ) : (
        <div className="create-form-container">
          <div className="package-selection">
            <h2>Selecciona un paquete</h2>
            <div className="packages-list">
              {packages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <div className="package-header">
                    <h3>{pkg.nombre}</h3>
                    <div className="package-price">${pkg.precio} USDT</div>
                  </div>
                  <div className="package-features">
                    {pkg.caracteristicas.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <img
                          className="checkmark-circle"
                          alt="Checkmark"
                          src="/img/checkmark-circle-sharp.svg"
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="token-form">
            <h2>Información del Token</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Token</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={tokenFormData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej. Florkafun Token"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="simbolo">Símbolo (3-5 caracteres)</label>
                <input
                  type="text"
                  id="simbolo"
                  name="simbolo"
                  value={tokenFormData.simbolo}
                  onChange={handleInputChange}
                  placeholder="Ej. FLK"
                  maxLength={5}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={tokenFormData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe tu token..."
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="red">Red Blockchain</label>
                <select
                  id="red"
                  name="red"
                  value={tokenFormData.red}
                  onChange={handleInputChange}
                >
                  <option value="solana">Solana</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="binance">Binance Smart Chain</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="supply">Supply Total</label>
                <input
                  type="text"
                  id="supply"
                  name="supply"
                  value={tokenFormData.supply}
                  onChange={handleInputChange}
                  placeholder="Ej. 1000000000"
                />
              </div>
              
              <button type="submit" className="submit-button">
                Continuar al Pago
              </button>
            </form>
          </div>
        </div>
      )}
      

      <div className="frame-84">
        <div className="frame-85">
          <div className="text-wrapper-50">About</div>

          <p className="koma-inu-the-most-2">
            Koma Inu – The Most Memeable Memecoin on BSC! Koma Inu is a
            dog-themed token built around community-driven decentralization and
            adoption. Powered by pure meme energy, $KOMA is created by the
            community, for the community. The cats had their time—now it&#39;s
            the dogs&#39; turn to lead and make BSC memecoins great again!.
          </p>

          <div className="text-wrapper-51">Token</div>

          <div className="frame-86">
            <div className="frame-87">
              <div className="text-wrapper-52">Address</div>

              <a
                className="text-wrapper-53"
                href="https://bscscan.com/address/0xd5eaAaC47bD1993d661bc087E15dfb079a7f3C19"
                rel="noopener noreferrer"
                target="_blank"
              >
                0xd5eaAaC47bD1993d661bc087E15dfb079a7f3C19
              </a>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-52">Name</div>

              <div className="text-wrapper-54">Koma Inu</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-55">Symbol</div>

              <div className="text-wrapper-56">KOMA</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-52">Decimals</div>

              <div className="text-wrapper-54">18</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-57">Total supply</div>

              <div className="text-wrapper-58">1,000,000,000</div>
            </div>
          </div>

          <div className="frame-86">
            <div className="frame-87">
              <div className="text-wrapper-59">Manual Listing</div>

              <p className="text-wrapper-60">
                Liquidity will not be automatically added!
              </p>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-52">Address</div>

              <div className="text-wrapper-61">
                0x497CAc1A0b1458fA900D1e9C73071Ac0ed975853
              </div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-59">Tokens For Presale</div>

              <p className="text-wrapper-62">
                Do not send BNB to the pool address
              </p>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-52">SoftCap</div>

              <div className="text-wrapper-54">150,000,000 KOMA</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-63">HardCap</div>

              <div className="text-wrapper-58">150 BNB</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-63">Presale rate</div>

              <div className="text-wrapper-58">300 BNB</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-63">Start time</div>

              <p className="text-wrapper-58">1 BNB = 500,000 KOMA</p>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-63">Unsold tokens</div>

              <div className="text-wrapper-58">Refund</div>
            </div>

            <div className="frame-87">
              <div className="text-wrapper-63">Liquidity percent</div>

              <div className="text-wrapper-64">(Manual Listing)</div>
            </div>
          </div>
        </div>

        <div className="frame-88">
          <p className="text-wrapper-65">
            Sign up our mailing list to receive our new presales, features, tips
            and reviews for next 100x projects
          </p>

          <div className="text-wrapper-66">Email</div>

          <div className="rectangle-9" />

          <div className="frame-89">
            <div className="text-wrapper-67">Subscribe</div>
          </div>
        </div>
      </div>
    </div>
  );
};
