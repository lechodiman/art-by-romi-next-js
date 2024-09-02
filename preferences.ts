import MercadoPagoConfig, { Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);

preference
  .create({
    body: {
      items: [
        {
          id: 'test_product_1',
          title: 'Test Product',
          unit_price: 1000,
          quantity: 1,
        },
      ],
      back_urls: {
        success:
          'https://retratosromi-git-feature-mercado-pago-luis-chodimans-projects.vercel.app/api/feedback',
        failure:
          'https://retratosromi-git-feature-mercado-pago-luis-chodimans-projects.vercel.app/api/feedback',
        pending:
          'https://retratosromi-git-feature-mercado-pago-luis-chodimans-projects.vercel.app/api/feedback',
      },
      auto_return: 'approved',
    },
  })
  .then(console.log)
  .catch(console.error);
