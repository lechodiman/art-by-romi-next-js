// Main entry point for payment providers
export * from './types';
export * from './registry';
export { MercadoPagoProvider } from './mercadopago';

// Re-export commonly used functions for convenience
import { getPaymentProvider, getProviderConfig } from './registry';
export { getPaymentProvider, getProviderConfig };