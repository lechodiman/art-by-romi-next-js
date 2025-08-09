import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import crypto from 'crypto';
import {
  PaymentProvider,
  PaymentProviderConfig,
  CreatePaymentIntentParams,
  PaymentIntentResponse,
  ProcessWebhookParams,
  WebhookResponse,
  RefundParams,
  RefundResponse,
  PaymentProviderError,
} from './types';

export class MercadoPagoProvider implements PaymentProvider {
  name = 'mercadopago';

  private client?: MercadoPagoConfig;
  private webhookSecret?: string;

  initialize(config: PaymentProviderConfig): void {
    if (!config.apiKey) {
      throw new PaymentProviderError(
        'MercadoPago access token is required',
        'MISSING_ACCESS_TOKEN',
        this.name
      );
    }

    this.client = new MercadoPagoConfig({
      accessToken: config.apiKey,
      options: {
        timeout: 5000,
        idempotencyKey: crypto.randomUUID(),
      },
    });

    this.webhookSecret = config.webhookSecret;
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntentResponse> {
    if (!this.client) {
      throw new PaymentProviderError(
        'MercadoPago client not initialized',
        'CLIENT_NOT_INITIALIZED',
        this.name
      );
    }

    try {
      const preference = new Preference(this.client);

      // Create preference for payment
      const preferenceData = {
        body: {
          items: params.items.map((item) => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            description: item.description,
            currency_id: params.currency || 'CLP',
          })),
          payer: {
            name: params.customer.firstName,
            surname: params.customer.lastName,
            email: params.customer.email,
            phone: {
              number: params.customer.phone,
            },
            identification: {
              type: 'RUT',
              number: params.customer.rut,
            },
          },
          back_urls: {
            success:
              params.returnUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/confirmacion`,
            failure:
              params.cancelUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/confirmacion`,
            pending:
              params.returnUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/confirmacion`,
          },
          auto_return: 'approved',
          payment_methods: {
            excluded_payment_types: [],
            installments: 12, // Maximum installments allowed
          },
          notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`,
          statement_descriptor: 'Art by Romi',
          external_reference: params.orderId,
          metadata: {
            order_id: params.orderId,
            ...params.metadata,
          },
        },
      };

      const preferenceResponse = await preference.create(preferenceData);

      if (!preferenceResponse.id || !preferenceResponse.init_point) {
        throw new PaymentProviderError(
          'Failed to create MercadoPago preference',
          'PREFERENCE_CREATION_FAILED',
          this.name,
          preferenceResponse
        );
      }

      return {
        id: preferenceResponse.id,
        status: 'pending',
        amount: params.amount,
        currency: params.currency || 'CLP',
        redirectUrl: preferenceResponse.init_point, // URL to redirect user for payment
        additionalData: {
          preferenceId: preferenceResponse.id,
          sandboxInitPoint: preferenceResponse.sandbox_init_point,
          initPoint: preferenceResponse.init_point,
        },
      };
    } catch (error: any) {
      throw new PaymentProviderError(
        error.message || 'Failed to create payment intent',
        error.code || 'UNKNOWN_ERROR',
        this.name,
        error
      );
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentIntentResponse> {
    if (!this.client) {
      throw new PaymentProviderError(
        'MercadoPago client not initialized',
        'CLIENT_NOT_INITIALIZED',
        this.name
      );
    }

    try {
      const payment = new Payment(this.client);
      const response = await payment.get({ id: paymentId });

      let status: PaymentIntentResponse['status'] = 'pending';

      switch (response.status) {
        case 'approved':
          status = 'succeeded';
          break;
        case 'pending':
        case 'in_process':
        case 'authorized':
          status = 'pending';
          break;
        case 'rejected':
        case 'cancelled':
        case 'refunded':
        case 'charged_back':
          status = 'failed';
          break;
      }

      return {
        id: response.id ? response.id.toString() : '',
        status,
        amount: response.transaction_amount || 0,
        currency: response.currency_id || 'CLP',
        metadata: response.metadata,
        additionalData: {
          status_detail: response.status_detail,
          payment_method_id: response.payment_method_id,
          payment_type_id: response.payment_type_id,
          date_approved: response.date_approved,
          date_created: response.date_created,
        },
      };
    } catch (error: any) {
      throw new PaymentProviderError(
        error.message || 'Failed to get payment status',
        error.code || 'UNKNOWN_ERROR',
        this.name,
        error
      );
    }
  }

  async processWebhook(params: ProcessWebhookParams): Promise<WebhookResponse> {
    const { body, headers } = params;

    // Verify webhook signature if secret is configured
    if (this.webhookSecret) {
      const xSignature = headers['x-signature'] as string;
      const xRequestId = headers['x-request-id'] as string;

      if (!xSignature || !xRequestId) {
        return {
          success: false,
          error: 'Missing webhook signature or request ID',
        };
      }

      // Parse the x-signature header to extract ts and v1
      const parts = xSignature.split(',');
      let ts: string | null = null;
      let hash: string | null = null;

      for (const part of parts) {
        const [key, value] = part.split('=');
        if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === 'ts') {
            ts = trimmedValue;
          } else if (trimmedKey === 'v1') {
            hash = trimmedValue;
          }
        }
      }

      if (!ts || !hash) {
        return {
          success: false,
          error: 'Invalid x-signature format',
        };
      }

      // Parse the body to get the data.id
      let parsedBody;
      try {
        parsedBody = JSON.parse(body.toString());
      } catch (error) {
        return {
          success: false,
          error: 'Invalid webhook body format',
        };
      }

      const dataId = parsedBody.data?.id;
      if (!dataId) {
        return {
          success: false,
          error: 'Missing data.id in webhook body',
        };
      }

      // Generate the manifest string
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

      // Create HMAC signature
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      hmac.update(manifest);
      const calculatedSignature = hmac.digest('hex');

      if (calculatedSignature !== hash) {
        return {
          success: false,
          error: 'Invalid webhook signature',
        };
      }
    }

    try {
      const event = JSON.parse(body.toString());

      // Handle different webhook types
      switch (event.type) {
        case 'payment':
          const paymentId = event.data.id;
          const paymentStatus = await this.getPaymentStatus(paymentId.toString());

          return {
            success: true,
            paymentId: paymentId.toString(),
            status:
              paymentStatus.status === 'succeeded'
                ? 'succeeded'
                : paymentStatus.status === 'failed'
                  ? 'failed'
                  : 'pending',
            metadata: paymentStatus.metadata,
          };

        case 'merchant_order':
          // Handle merchant order updates if needed
          return {
            success: true,
            metadata: { type: 'merchant_order', data: event.data },
          };

        default:
          return {
            success: true,
            metadata: { type: event.type, data: event.data },
          };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to process webhook',
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    if (!this.client) {
      throw new PaymentProviderError(
        'MercadoPago client not initialized',
        'CLIENT_NOT_INITIALIZED',
        this.name
      );
    }

    try {
      const payment = new Payment(this.client);
      await payment.cancel({ id: Number(paymentId) });
    } catch (error: any) {
      throw new PaymentProviderError(
        error.message || 'Failed to cancel payment',
        error.code || 'UNKNOWN_ERROR',
        this.name,
        error
      );
    }
  }

  async refundPayment(params: RefundParams): Promise<RefundResponse> {
    if (!this.client) {
      throw new PaymentProviderError(
        'MercadoPago client not initialized',
        'CLIENT_NOT_INITIALIZED',
        this.name
      );
    }

    try {
      // MercadoPago refunds are handled through the API
      // The SDK doesn't expose a direct refund method, so we use the API directly
      const refundData = {
        amount: params.amount,
      };

      // Get the access token from the client config
      const accessToken = (this.client as any).accessToken;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${params.paymentId}/refunds`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': crypto.randomUUID(),
          },
          body: JSON.stringify(params.amount ? refundData : {}),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new PaymentProviderError(
          error.message || 'Failed to process refund',
          error.error || 'REFUND_FAILED',
          this.name,
          error
        );
      }

      const refund = await response.json();

      return {
        id: refund.id.toString(),
        status: refund.status === 'approved' ? 'succeeded' : 'failed',
        amount: refund.amount,
        currency: refund.currency_id || 'CLP',
      };
    } catch (error: any) {
      throw new PaymentProviderError(
        error.message || 'Failed to refund payment',
        error.code || 'UNKNOWN_ERROR',
        this.name,
        error
      );
    }
  }

  async getAvailablePaymentMethods(): Promise<string[]> {
    // MercadoPago supports various payment methods depending on the country
    return ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'mercadopago_wallet'];
  }
}
