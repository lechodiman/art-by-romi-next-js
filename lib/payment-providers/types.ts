// Common types for all payment providers
export interface PaymentProviderConfig {
  apiKey: string;
  secretKey?: string;
  webhookSecret?: string;
  environment?: 'sandbox' | 'production';
  [key: string]: any; // Provider-specific config
}

export interface CreatePaymentIntentParams {
  orderId: string;
  amount: number;
  currency?: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    rut: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
  metadata?: Record<string, any>;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentIntentResponse {
  id: string; // Provider's payment ID
  clientSecret?: string; // For client-side confirmation
  status: 'pending' | 'requires_action' | 'succeeded' | 'failed';
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  redirectUrl?: string; // For redirect-based flows
  additionalData?: Record<string, any>; // Provider-specific data
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  signature?: string;
}

export interface ProcessWebhookParams {
  body: string | Buffer;
  headers: Record<string, string | string[] | undefined>;
}

export interface WebhookResponse {
  success: boolean;
  paymentId?: string;
  status?: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  error?: string;
  metadata?: Record<string, any>;
}

export interface RefundParams {
  paymentId: string;
  amount?: number; // Optional for partial refunds
  reason?: string;
}

export interface RefundResponse {
  id: string;
  status: 'pending' | 'succeeded' | 'failed';
  amount: number;
  currency: string;
}

// Base interface that all payment providers must implement
export interface PaymentProvider {
  name: string;

  // Initialize the provider with configuration
  initialize(config: PaymentProviderConfig): void;

  // Create a payment intent
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResponse>;

  // Retrieve payment status
  getPaymentStatus(paymentId: string): Promise<PaymentIntentResponse>;

  // Process webhook events
  processWebhook(params: ProcessWebhookParams): Promise<WebhookResponse>;

  // Cancel a payment
  cancelPayment(paymentId: string): Promise<void>;

  // Refund a payment (optional)
  refundPayment?(params: RefundParams): Promise<RefundResponse>;

  // Get available payment methods (optional)
  getAvailablePaymentMethods?(): Promise<string[]>;
}

// Error class for payment-related errors
export class PaymentProviderError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentProviderError';
  }
}
