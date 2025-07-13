import nodemailer from 'nodemailer';
import { Order, OrderItem } from '@/types/database';

interface OrderConfirmationEmailParams {
  order: Order;
  items: OrderItem[];
  paymentMethod: string;
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Generate HTML email template
const generateOrderConfirmationHTML = (params: OrderConfirmationEmailParams): string => {
  const { order, items, paymentMethod } = params;
  
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong>
        ${item.pet_count > 1 ? `<br><small>${item.pet_count} mascotas</small>` : ''}
        ${item.has_special_background ? '<br><small>Con fondo especial</small>' : ''}
        ${item.has_frame ? `<br><small>Con marco (${item.frame_size || 'estándar'})</small>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatCurrency(item.unit_price)}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatCurrency(item.total_price)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido - Art by Romi</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0;">
          <h1 style="color: #2c3e50; margin: 0;">Art by Romi</h1>
          <p style="color: #7f8c8d; margin: 5px 0;">Retratos Personalizados de Mascotas</p>
        </div>

        <!-- Order Confirmation -->
        <div style="padding: 30px 0;">
          <h2 style="color: #27ae60; text-align: center;">¡Pedido Confirmado!</h2>
          <p style="text-align: center; font-size: 16px;">
            Gracias por tu compra, <strong>${order.customer_first_name}</strong>.
          </p>
          <p style="text-align: center; color: #7f8c8d;">
            Tu pedido <strong>#${order.order_number}</strong> ha sido recibido y está siendo procesado.
          </p>
        </div>

        <!-- Order Details -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Detalles del Pedido</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e9ecef;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cantidad</th>
                <th style="padding: 10px; text-align: right;">Precio</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">
                  Subtotal:
                </td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">
                  ${formatCurrency(order.subtotal)}
                </td>
              </tr>
              ${order.shipping_cost > 0 ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;">
                  Envío:
                </td>
                <td style="padding: 10px; text-align: right;">
                  ${formatCurrency(order.shipping_cost)}
                </td>
              </tr>
              ` : ''}
              <tr style="background-color: #e9ecef;">
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">
                  Total:
                </td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #27ae60;">
                  ${formatCurrency(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Shipping Information -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Información de Envío</h3>
          <p style="margin: 5px 0;">
            <strong>${order.customer_first_name} ${order.customer_last_name}</strong><br>
            ${order.shipping_address}<br>
            ${order.shipping_additional_info ? `${order.shipping_additional_info}<br>` : ''}
            ${order.shipping_comuna}, ${order.shipping_region}<br>
            <strong>Teléfono:</strong> ${order.customer_phone}<br>
            <strong>Email:</strong> ${order.customer_email}
          </p>
        </div>

        <!-- Payment Information -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Información de Pago</h3>
          <p style="margin: 5px 0;">
            <strong>Método de pago:</strong> ${paymentMethod === 'mercadopago' ? 'MercadoPago' : paymentMethod}<br>
            <strong>Estado:</strong> <span style="color: #27ae60;">Confirmado</span>
          </p>
        </div>

        <!-- Next Steps -->
        <div style="padding: 20px 0; text-align: center;">
          <h3 style="color: #2c3e50;">¿Qué sigue?</h3>
          <p style="color: #7f8c8d;">
            Te contactaremos pronto para coordinar los detalles de tu retrato personalizado.
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 0; border-top: 2px solid #e0e0e0; margin-top: 40px;">
          <p style="color: #7f8c8d; margin: 5px 0;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
          <p style="color: #7f8c8d; margin: 5px 0;">
            © ${new Date().getFullYear()} Art by Romi. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email
const generateOrderConfirmationText = (params: OrderConfirmationEmailParams): string => {
  const { order, items, paymentMethod } = params;
  
  const itemsList = items.map(item => {
    let description = `- ${item.product_name} x${item.quantity} - ${formatCurrency(item.total_price)}`;
    if (item.pet_count > 1) description += ` (${item.pet_count} mascotas)`;
    if (item.has_special_background) description += ' (con fondo especial)';
    if (item.has_frame) description += ` (con marco ${item.frame_size || 'estándar'})`;
    return description;
  }).join('\n');

  return `
Art by Romi - Confirmación de Pedido

¡Pedido Confirmado!

Gracias por tu compra, ${order.customer_first_name}.
Tu pedido #${order.order_number} ha sido recibido y está siendo procesado.

DETALLES DEL PEDIDO:
${itemsList}

Subtotal: ${formatCurrency(order.subtotal)}
${order.shipping_cost > 0 ? `Envío: ${formatCurrency(order.shipping_cost)}` : ''}
Total: ${formatCurrency(order.total)}

INFORMACIÓN DE ENVÍO:
${order.customer_first_name} ${order.customer_last_name}
${order.shipping_address}
${order.shipping_additional_info || ''}
${order.shipping_comuna}, ${order.shipping_region}
Teléfono: ${order.customer_phone}
Email: ${order.customer_email}

INFORMACIÓN DE PAGO:
Método de pago: ${paymentMethod === 'mercadopago' ? 'MercadoPago' : paymentMethod}
Estado: Confirmado

¿QUÉ SIGUE?
Te contactaremos pronto para coordinar los detalles de tu retrato personalizado.
Si tienes alguna pregunta, no dudes en contactarnos.

---
Este es un correo automático, por favor no respondas a este mensaje.
© ${new Date().getFullYear()} Art by Romi. Todos los derechos reservados.
  `;
};

export async function sendOrderConfirmationEmail(
  params: OrderConfirmationEmailParams
): Promise<void> {
  const transporter = createTransporter();
  
  const htmlContent = generateOrderConfirmationHTML(params);
  const textContent = generateOrderConfirmationText(params);

  await transporter.sendMail({
    from: `Art by Romi <${process.env.MAILER_EMAIL}>`,
    to: params.order.customer_email,
    bcc: process.env.RECIPIENT_EMAIL, // Copy to admin
    subject: `Confirmación de Pedido #${params.order.order_number} - Art by Romi`,
    text: textContent,
    html: htmlContent,
  });
}