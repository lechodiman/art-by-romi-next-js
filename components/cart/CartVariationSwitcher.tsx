import Link from 'next/link';
import { useRouter } from 'next/router';

export function CartVariationSwitcher() {
  const router = useRouter();
  const currentPath = router.pathname;

  const variations = [
    { path: '/carrito', label: 'Clásico', description: 'Vista de lista tradicional' },
    { path: '/carrito-cards', label: 'Tarjetas', description: 'Vista de cuadrícula con tarjetas' },
    { path: '/carrito-minimal', label: 'Minimalista', description: 'Diseño limpio y simple' },
  ];

  return (
    <div className="max-w-6xl mx-auto mb-6 p-4 bg-zinc-100 rounded-lg">
      <p className="text-sm text-gray-600 mb-3">Selecciona un estilo de carrito:</p>
      <div className="flex flex-wrap gap-3">
        {variations.map((variation) => (
          <Link
            key={variation.path}
            href={variation.path}
            className={`px-4 py-2 rounded-md transition-all ${
              currentPath === variation.path
                ? 'bg-zinc-700 text-white'
                : 'bg-white text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <span className="font-medium">{variation.label}</span>
            <span className="hidden sm:inline text-sm opacity-75 ml-2">
              - {variation.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}