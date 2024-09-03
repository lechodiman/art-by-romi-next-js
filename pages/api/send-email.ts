import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, message, captchaValue } = req.body;

    if (!email || !message || !captchaValue) {
      res.status(400).json({ error: 'Email, message, and captcha are required' });
      return;
    }

    try {
      // Verify reCAPTCHA
      const recaptchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`
      );

      if (!recaptchaResponse.data.success) {
        res.status(400).json({ error: 'Invalid captcha' });
        return;
      }

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
