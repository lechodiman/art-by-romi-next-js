import Link from 'next/link';
import { Package, Palette, Heart, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function EmptyCart() {
  const testimonials = [
    {
      text: "El retrato de mi mascota superó todas mis expectativas. Un trabajo excepcional.",
      author: "María G."
    },
    {
      text: "Capturó perfectamente la personalidad de mi perro. Un regalo inolvidable.",
      author: "Carlos M."
    },
    {
      text: "Profesionalismo y talento. Mi gato nunca se vio tan majestuoso.",
      author: "Ana P."
    }
  ];

  // Use state to handle testimonial selection after hydration
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  
  useEffect(() => {
    // Select random testimonial only on client side after hydration
    setTestimonialIndex(Math.floor(Math.random() * testimonials.length));
  }, [testimonials.length]);
  
  const randomTestimonial = testimonials[testimonialIndex];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl mx-auto text-center space-y-12">
        {/* Empty cart icon with subtle animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-zinc-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <Package className="w-20 h-20 mx-auto text-zinc-300 relative z-10" strokeWidth={1} />
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h2 className="font-serif text-3xl text-neutral-700 tracking-wide">
            Tu carrito está vacío
          </h2>
          <p className="text-neutral-500 font-light text-lg">
            Comienza tu viaje artístico personalizado
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-2 group cursor-default">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-50 flex items-center justify-center transition-all group-hover:bg-zinc-100">
              <Palette className="w-6 h-6 text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-neutral-600 font-light">Elige tu estilo</p>
          </div>
          <div className="space-y-2 group cursor-default">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-50 flex items-center justify-center transition-all group-hover:bg-zinc-100">
              <Heart className="w-6 h-6 text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-neutral-600 font-light">Personaliza detalles</p>
          </div>
          <div className="space-y-2 group cursor-default">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-50 flex items-center justify-center transition-all group-hover:bg-zinc-100">
              <Package className="w-6 h-6 text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-neutral-600 font-light">Recibe tu obra</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="border-t border-zinc-100 pt-8">
          <blockquote className="space-y-3">
            <p className="text-neutral-500 italic font-light">
              &ldquo;{randomTestimonial.text}&rdquo;
            </p>
            <cite className="text-sm text-neutral-400 not-italic">
              — {randomTestimonial.author}
            </cite>
          </blockquote>
        </div>

        {/* CTA Button */}
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-light tracking-wider text-white bg-zinc-800 rounded-sm transition-all hover:bg-zinc-700 hover:gap-3 group"
        >
          DESCUBRIR COLECCIÓN
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
        </Link>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-8 text-xs text-neutral-400 font-light">
          <span>✓ Envío seguro</span>
          <span>✓ Trabajo artesanal</span>
          <span>✓ Satisfacción garantizada</span>
        </div>
      </div>
    </div>
  );
}