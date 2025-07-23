import apiService from './api';

class SwapService {
  // Get all available tokens for swap
  async getAvailableTokens() {
    try {
      const response = await apiService.get('/tokens', {
        'filters[estado][$eq]': 'lanzado',
        'populate': 'imagen',
        'sort': 'createdAt:desc'
      });
      return response;
    } catch (error) {
      console.error('Error fetching available tokens:', error);
      throw error;
    }
  }

  // Get token price
  async getTokenPrice(tokenId) {
    try {
      // In a real app, this would fetch the current price from an oracle or API
      // For now, we'll simulate it
      return {
        success: true,
        price: Math.random() * 0.01, // Random price between 0 and 0.01 SOL
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  // Calculate swap amount
  calculateSwapAmount(fromAmount, fromPrice, toPrice, fee = 0.01) {
    // Apply fee
    const amountAfterFee = fromAmount * (1 - fee);
    
    // Calculate equivalent value
    const valueInSOL = amountAfterFee * fromPrice;
    
    // Convert to target token
    const toAmount = valueInSOL / toPrice;
    
    return {
      fromAmount,
      toAmount,
      fee: fromAmount * fee,
      rate: fromPrice / toPrice,
      valueInSOL
    };
  }

  // Execute swap
  async executeSwap(fromTokenId, toTokenId, fromAmount, toAmount, userId) {
    try {
      // In a real app, this would interact with the blockchain
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Record the swap in the database
      const swapData = {
        data: {
          tokenOrigen: fromTokenId,
          tokenDestino: toTokenId,
          usuario: userId,
          cantidadOrigen: fromAmount,
          cantidadDestino: toAmount,
          tasaCambio: toAmount / fromAmount,
          estado: 'completado',
          txHashSolana: `tx_${Math.random().toString(36).substring(2, 15)}`,
          fechaEjecucion: new Date().toISOString()
        }
      };
      
      const response = await apiService.post('/swaps', swapData);
      
      return {
        success: true,
        transactionId: swapData.data.txHashSolana,
        fromAmount,
        toAmount,
        timestamp: new Date().toISOString(),
        ...response
      };
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  // Get user swap history
  async getUserSwapHistory(userId) {
    try {
      const response = await apiService.get('/swaps', {
        'filters[usuario][$eq]': userId,
        'populate': 'tokenOrigen,tokenDestino',
        'sort': 'createdAt:desc'
      });
      return response;
    } catch (error) {
      console.error('Error fetching user swap history:', error);
      throw error;
    }
  }
}

const swapService = new SwapService();
export default swapService;