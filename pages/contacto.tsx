import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Contacto() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !message || !captchaValue) {
      setEmailError(!email);
      setMessageError(!message);
      setCaptchaError(!captchaValue);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message, captchaValue }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
        setMessage('');
        setCaptchaValue(null);
        recaptchaRef.current?.reset();
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="px-5">
      <section className='pt-40 pb-20 bg-gray-200'>
        <div className='container mx-auto space-y-16 text-center'>
          <h1 className='max-w-5xl mx-auto font-serif text-4xl tracking-widest uppercase sm:text-6xl text-neutral-700 lg:text-7xl'>
            Me encantaría hablar contigo
          </h1>

          <div className='max-w-xl mx-auto space-y-4'>
            <p className='text-lg leading-relaxed'>
              Puedes dejar registrado tu interes en comisionar un retrato usando el
              formulario de contacto abajo o enviándome un email directamente. Yo me
              pondré en contacto contigo para discutir tu retrato en más detalle y los
              tiempos de espera actuales.
            </p>
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

            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                onChange={(value) => {
                  setCaptchaValue(value);
                  setCaptchaError(false);
                }}
              />
              {captchaError && (
                <p className='text-red-500'>Por favor completa el captcha</p>
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
