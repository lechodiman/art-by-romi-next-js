import { NextApiRequest, NextApiResponse } from 'next';
import { getPaymentProvider, getProviderConfig } from '@/lib/payment-providers';
import { OrderService } from '@/lib/services/order-service';
import { sendOrderConfirmationEmail } from '@/lib/email/order-confirmation';

// Disable body parsing to get raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  
  return new Promise<Buffer>((resolve, reject) => {
    req.on('data', (chunk) => {
      // Ensure chunk is converted to Uint8Array
      const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
      chunks.push(new Uint8Array(buffer));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider: providerName } = req.query;

  if (!providerName || typeof providerName !== 'string') {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    // Get payment provider
    const providerConfig = getProviderConfig(providerName);
    const paymentProvider = getPaymentProvider(providerName, providerConfig);

    // Process webhook
    const webhookResult = await paymentProvider.processWebhook({
      body: rawBody,
      headers: req.headers
    });

    if (!webhookResult.success) {
      console.error(`Webhook processing failed for ${providerName}:`, webhookResult.error);
      return res.status(400).json({ error: webhookResult.error });
    }

    // If we have a payment ID and status, update our records
    if (webhookResult.paymentId && webhookResult.status) {
      // Get payment intent from our database
      const paymentIntent = await OrderService.getPaymentIntentByProviderId(
        providerName,
        webhookResult.paymentId
      );

      if (!paymentIntent) {
        console.error(`Payment intent not found for ${providerName} payment ${webhookResult.paymentId}`);
        return res.status(200).json({ received: true }); // Still return 200 to acknowledge receipt
      }

      // Update payment intent status
      await OrderService.updatePaymentIntent(paymentIntent.id, {
        status: webhookResult.status,
        provider_data: {
          ...(paymentIntent.provider_data as any || {}),
          webhookData: webhookResult.metadata
        }
      });

      // If payment succeeded, update order status and send confirmation
      if (webhookResult.status === 'succeeded') {
        const order = await OrderService.getOrder(paymentIntent.order_id);
        
        if (order) {
          // Update order status to processing
          await OrderService.updateOrderStatus(
            order.id,
            'processing',
            {
              paymentConfirmedAt: new Date().toISOString(),
              paymentMethod: providerName
            }
          );

          // Get order items for the email
          const orderItems = await OrderService.getOrderItems(order.id);

          // Send confirmation email
          try {
            await sendOrderConfirmationEmail({
              order,
              items: orderItems,
              paymentMethod: providerName
            });
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the webhook if email fails
          }
        }
      } else if (webhookResult.status === 'failed' || webhookResult.status === 'cancelled') {
        // Update order status to failed
        const order = await OrderService.getOrder(paymentIntent.order_id);
        if (order) {
          await OrderService.updateOrderStatus(
            order.id,
            'failed',
            {
              paymentFailedAt: new Date().toISOString(),
              failureReason: webhookResult.error || 'Payment failed'
            }
          );
        }
      }
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });

  } catch (error: any) {
    console.error(`Webhook error for ${providerName}:`, error);
    
    // Still return 200 to prevent retries for processing errors
    res.status(200).json({ 
      received: true,
      error: 'Internal processing error'
    });
  }
}