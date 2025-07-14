# Payment Integration Documentation

This document explains the payment processing architecture implemented for Art by Romi's e-commerce platform.

## Overview

The payment system is designed to be extensible and support multiple payment providers. Currently, MercadoPago is implemented as the primary payment processor, with the architecture ready to accommodate additional providers like Stripe or PayPal.

## Architecture

### Key Components

1. **Payment Provider Interface** (`/lib/payment-providers/types.ts`)
   - Defines a standard interface that all payment providers must implement
   - Ensures consistency across different payment methods

2. **Payment Provider Registry** (`/lib/payment-providers/registry.ts`)
   - Manages payment provider instances
   - Provides factory methods for creating providers
   - Handles provider configuration from environment variables

3. **MercadoPago Implementation** (`/lib/payment-providers/mercadopago.ts`)
   - Implements the PaymentProvider interface for MercadoPago
   - Handles payment intents, webhooks, and refunds

4. **Order Service** (`/lib/services/order-service.ts`)
   - Manages order creation and updates in Supabase
   - Handles payment intent records
   - Provides idempotency support

## Database Schema

### Tables

1. **orders**
   - Stores main order information
   - Customer details, shipping address, totals
   - Status tracking

2. **order_items**
   - Individual items within an order
   - Product details and customizations
   - Pricing information

3. **payment_intents**
   - Payment processing records
   - Provider-specific payment IDs
   - Status and error tracking

See `/lib/supabase/migrations/001_create_orders_tables.sql` for the complete schema.

## Payment Flow

1. **Checkout Process**
   - Customer fills out contact and shipping information
   - Order is created in database with 'pending' status
   - Payment intent is created with the selected provider

2. **Payment Processing**
   - For MercadoPago: Customer is redirected to MercadoPago checkout
   - Payment is processed on the provider's platform
   - Customer is redirected back to the confirmation page

3. **Webhook Handling**
   - Provider sends webhook notifications for payment events
   - Webhook endpoint verifies signature and updates order status
   - Confirmation email is sent on successful payment

4. **Order Confirmation**
   - Success page shows order details and next steps
   - Failed payments show retry options

## Configuration

### Environment Variables

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your-access-token
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret
MERCADOPAGO_ENVIRONMENT=sandbox # or 'production'

# Supabase (for order storage)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application URL
NEXT_PUBLIC_URL=https://your-domain.com
```

### MercadoPago Setup

1. Create a MercadoPago account at https://www.mercadopago.com
2. Get your Access Token from the credentials section
3. Configure webhook notifications:
   - URL: `https://your-domain.com/api/webhooks/mercadopago`
   - Events: Payment notifications

## API Endpoints

### POST /api/create-order
Creates a new order in the database.

**Request Body:**
```json
{
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "rut": "12.345.678-9",
    "phone": "+56 9 1234 5678",
    "address": "Calle Principal 123",
    "region": "Metropolitana",
    "comuna": "Santiago"
  },
  "items": [
    {
      "productId": "product-id",
      "quantity": 1,
      "customizations": {
        "petCount": 2,
        "hasSpecialBackground": true
      }
    }
  ]
}
```

### POST /api/create-payment-intent
Creates a payment intent with the specified provider.

**Request Body:**
```json
{
  "provider": "mercadopago",
  "orderId": "order-uuid",
  "items": [...],
  "customer": {...}
}
```

### POST /api/webhooks/[provider]
Handles webhook notifications from payment providers.

## Adding New Payment Providers

To add a new payment provider:

1. **Create Provider Implementation**
   ```typescript
   // /lib/payment-providers/stripe.ts
   export class StripeProvider implements PaymentProvider {
     // Implement all required methods
   }
   ```

2. **Register Provider**
   ```typescript
   // /lib/payment-providers/registry.ts
   const providers = {
     mercadopago: MercadoPagoProvider,
     stripe: StripeProvider, // Add new provider
   };
   ```

3. **Add Configuration**
   ```typescript
   // In getProviderConfig function
   case 'stripe':
     return {
       apiKey: process.env.STRIPE_SECRET_KEY || '',
       webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
     };
   ```

4. **Update Environment Variables**
   - Add provider-specific keys to `.env`
   - Update `.env.example` with new variables

## Testing

### Sandbox Testing

1. Use MercadoPago test credentials
2. Test cards available at: https://www.mercadopago.com/developers/en/docs/checkout-pro/additional-content/test-cards

### Test Flow

1. Add items to cart
2. Proceed to checkout
3. Fill out customer information
4. Complete payment on MercadoPago
5. Verify order status and email delivery

## Security Considerations

1. **Webhook Verification**
   - All webhooks verify signatures to ensure authenticity
   - Raw body parsing is used to maintain signature integrity

2. **Idempotency**
   - Payment intents use idempotency keys to prevent duplicate charges
   - Based on order ID and provider combination

3. **Environment Variables**
   - Never commit API keys to version control
   - Use different keys for development and production

4. **Database Security**
   - Row Level Security (RLS) enabled on all tables
   - Service role key required for order operations
   - Users can only view their own orders

## Troubleshooting

### Common Issues

1. **Payment Not Updating**
   - Check webhook configuration in MercadoPago dashboard
   - Verify webhook secret is correct
   - Check server logs for webhook errors

2. **Email Not Sending**
   - Verify email configuration in environment variables
   - Check SMTP credentials
   - Review email service logs

3. **Order Not Creating**
   - Ensure Supabase service role key is configured
   - Check Supabase connection
   - Verify product IDs exist in Sanity

## Future Enhancements

1. **Additional Payment Methods**
   - Implement Stripe for credit card processing
   - Add PayPal support
   - Enable bank transfer options

2. **Enhanced Features**
   - Partial refunds
   - Payment installments
   - Saved payment methods
   - Order tracking integration

3. **Analytics**
   - Payment conversion tracking
   - Failed payment analysis
   - Revenue reporting