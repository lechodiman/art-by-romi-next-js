import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    if (!email || !message) {
      res.status(400).json({ error: 'Email and message are required' });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', // hostname
        port: 587, // port for secure SMTP
        auth: {
          user: process.env.MAILER_EMAIL,
          pass: process.env.MAILER_PASSWORD,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      await transporter.sendMail({
        from: `Pinturas Romi <lechodiman@uc.cl>`,
        to: 'lechodiman@uc.cl',
        subject: 'Nuevo mensaje de la página de pinturitas',
        text: `Email: ${email}\n\nMessage: ${message}`,
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
