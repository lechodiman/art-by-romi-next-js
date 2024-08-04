import MercadoPagoConfig, { Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);

// preference
//   .create({
//     body: {
//       items: [
//         {
//           id: '2',
//           title: 'Retrato mediano',
//           unit_price: 40_000,
//           quantity: 1,
//         },
//       ],
//       back_urls: {
//         success: 'https://retratosromi.com/api/feedback',
//         failure: 'https://retratosromi.com/api/feedback',
//         pending: 'https://retratosromi.com/api/feedback',
//       },
//       auto_return: 'approved',
//     },
//   })
//   .then(console.log)
//   .catch(console.error);

preference
  .search({})
  .then((response) => {
    console.log(JSON.stringify(response, null, 2));
  })
  .catch(console.error);
