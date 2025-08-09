import { PaymentProvider, PaymentProviderConfig, PaymentProviderError } from './types';
import { MercadoPagoProvider } from './mercadopago';

// Registry of available payment providers
const providers: Record<string, new () => PaymentProvider> = {
  mercadopago: MercadoPagoProvider,
  // Add more providers here as they're implemented
  // stripe: StripeProvider,
  // paypal: PayPalProvider,
};

// Provider instances cache
const providerInstances: Map<string, PaymentProvider> = new Map();

/**
 * Get a payment provider instance by name
 * @param providerName - The name of the payment provider (e.g., 'mercadopago')
 * @param config - Optional configuration to initialize the provider
 * @returns The payment provider instance
 */
export function getPaymentProvider(
  providerName: keyof typeof providers,
  config?: PaymentProviderConfig
): PaymentProvider {
  // Check if provider exists
  const ProviderClass = providers[providerName.toLowerCase()];

  if (!ProviderClass) {
    throw new PaymentProviderError(
      `Payment provider '${providerName}' not found`,
      'PROVIDER_NOT_FOUND',
      providerName
    );
  }

  // Check cache for existing instance
  let provider = providerInstances.get(providerName);

  if (!provider) {
    // Create new instance
    provider = new ProviderClass();
    providerInstances.set(providerName, provider);
  }

  // Initialize with config if provided
  if (config) {
    provider.initialize(config);
  }

  return provider;
}

/**
 * Register a new payment provider
 * @param name - The name of the payment provider
 * @param providerClass - The provider class constructor
 */
export function registerPaymentProvider(
  name: string,
  providerClass: new () => PaymentProvider
): void {
  providers[name.toLowerCase()] = providerClass;
}

/**
 * Get list of available payment providers
 * @returns Array of provider names
 */
export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}

/**
 * Clear provider instances cache
 */
export function clearProviderCache(): void {
  providerInstances.clear();
}

// Helper function to get provider config from environment variables
export function getProviderConfig(providerName: string): PaymentProviderConfig {
  switch (providerName.toLowerCase()) {
    case 'mercadopago':
      return {
        apiKey: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
        webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
        environment:
          (process.env.MERCADOPAGO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      };

    // Add more provider configs here
    // case 'stripe':
    //   return {
    //     apiKey: process.env.STRIPE_SECRET_KEY || '',
    //     webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    //   };

    default:
      throw new PaymentProviderError(
        `No configuration found for provider '${providerName}'`,
        'CONFIG_NOT_FOUND',
        providerName
      );
  }
}
