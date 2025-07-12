import Link from 'next/link';

export function EmptyCart() {
  return (
    <div className="max-w-2xl p-8 mx-auto text-center bg-white rounded-lg shadow-md">
      <svg
        className="w-24 h-24 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <p className="mb-6 text-xl text-gray-600">Tu carrito está vacío</p>
      <Link
        href="/tienda"
        className="inline-block px-8 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600"
      >
        Explorar Tienda
      </Link>
    </div>
  );
}