import { useState } from 'react';

export default function Contacto() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !message) {
      setEmailError(!email);
      setMessageError(!message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
        setMessage('');
      } else {
        console.error(response.statusText);
      }

      setSubmitSuccess(true);
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <section className='pt-40 pb-20 bg-gray-200'>
        <div className='container mx-auto space-y-20 text-center'>
          <h1 className='font-serif text-4xl tracking-widest uppercase sm:text-6xl text-neutral-700 lg:text-7xl'>
            Me encantaría hablar contigo
          </h1>

          <div className='max-w-md mx-auto space-y-4'>
            <p className='leading-relaxed'>
              Puedes dejar registrado tu interes en comisionar un retrato usando el
              formulario de contacto abajo o enviándome un email directamente. Yo me
              pondré en contacto contigo para discutir tu retrato en más detalle y los
              tiempos de espera actuales.
            </p>

            <p> 📔 EMAIL: rdrivera@uc.cl</p>
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='container max-w-md mx-auto'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-neutral-700'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  emailError ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {emailError && (
                <p className='text-red-500'>Por favor ingresa un email válido</p>
              )}
            </div>

            <div>
              <label htmlFor='message' className='block text-neutral-700'>
                Mensaje
              </label>
              <textarea
                id='message'
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  messageError ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {messageError && (
                <p className='text-red-500'>Por favor ingresa un mensaje</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full px-4 py-2 text-white rounded-md bg-neutral-700 hover:bg-neutral-800'
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>

            {submitSuccess && (
              <p className='text-green-500'>
                ¡Gracias por tu mensaje! Te responderé pronto.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
