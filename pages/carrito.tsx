import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems, useCartActions } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types/Product';
import Image from 'next/image';
import { EmptyCart } from '@/components/cart/EmptyCart';

interface PricedCartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  customizations?: {
    extraPets?: number;
    hasSpecialBackground?: boolean;
    hasFrame?: boolean;
  };
  calculatedPrice: number;
  product?: Product;
}

interface CalculatePricesResponse {
  items: PricedCartItem[];
  total: number;
}

export default function Carrito() {
  const router = useRouter();
  const items = useCartItems();
  const { removeFromCart, updateQuantity } = useCartActions();
  const [pricedItems, setPricedItems] = useState<PricedCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calculatePrices() {
      if (items.length === 0) {
        setLoading(false);
        setPricedItems([]);
        setCartTotal(0);
        return;
      }

      try {
        // Transform cart items to match API format
        const apiItems = items.map((item) => ({
          cartItemId: item.cartItemId || '',
          productId: item.productId,
          quantity: item.quantity,
          customizations: {
            extraPets: parseInt(item.petCount) - 1,
            hasSpecialBackground: item.options.includes('special-background'),
            hasFrame: item.options.includes('frame'),
          },
        }));

        const response = await fetch('/api/calculate-cart-prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: apiItems }),
        });

        if (response.ok) {
          const data: CalculatePricesResponse = await response.json();
          setPricedItems(data.items);
          setCartTotal(data.total);
        } else {
          console.error('Failed to calculate cart prices');
        }
      } catch (error) {
        console.error('Error calculating cart prices:', error);
      } finally {
        setLoading(false);
      }
    }

    calculatePrices();
  }, [items]);

  const getCustomizationText = (item: PricedCartItem) => {
    const customizations = [];

    if (item.customizations?.extraPets && item.customizations.extraPets > 0) {
      customizations.push(
        `+${item.customizations.extraPets} mascota${item.customizations.extraPets === 1 ? '' : 's'} adicional${item.customizations.extraPets === 1 ? '' : 'es'}`
      );
    }

    if (item.customizations?.hasSpecialBackground) {
      customizations.push('Fondo especial');
    }

    if (item.customizations?.hasFrame && item.product?.size) {
      customizations.push(`Marco (${item.product.size})`);
    }

    return customizations.join(' • ');
  };

  if (loading) {
    return (
      <main className='flex-grow bg-gray-100'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
          <div className='max-w-6xl mx-auto text-center'>
            <p className='text-gray-600'>Cargando...</p>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className='flex-grow bg-gray-100'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
          <EmptyCart />
        </section>
      </main>
    );
  }

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>

        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Cart Items */}
            <div className='space-y-4 lg:col-span-2'>
              {pricedItems.map((item) => {
                if (!item.product) {
                  return (
                    <div
                      key={item.cartItemId}
                      className='p-6 border border-red-200 rounded-lg shadow-md bg-red-50'
                    >
                      <p className='text-red-600'>
                        Producto no disponible
                      </p>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className='mt-2 text-sm text-red-600 underline'
                      >
                        Eliminar del carrito
                      </button>
                    </div>
                  );
                }

                const product = item.product;

                return (
                  <div
                    key={item.cartItemId}
                    className='p-6 bg-white rounded-lg shadow-md'
                  >
                    <div className='flex flex-col gap-4 sm:flex-row'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0 w-full h-40 sm:w-32 sm:h-40'>
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className='object-cover rounded-lg'
                          sizes='(max-width: 640px) 100vw, 128px'
                        />
                      </div>

                      {/* Product Details */}
                      <div className='flex-grow space-y-2'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {product.name}
                        </h3>
                        <p className='text-sm text-gray-600'>{product.category}</p>

                        {/* Customizations */}
                        {getCustomizationText(item) && (
                          <p className='text-sm text-gray-700'>
                            Personalización: {getCustomizationText(item)}
                          </p>
                        )}

                        {/* Price */}
                        <div className='text-lg font-semibold text-gray-900'>
                          ${item.calculatedPrice.toLocaleString('es-CL')}
                          {item.quantity > 1 && (
                            <span className='text-sm font-normal text-gray-600'>
                              {' '}
                              x {item.quantity} = $
                              {(item.calculatedPrice * item.quantity).toLocaleString('es-CL')}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className='w-8 h-8 transition-colors bg-gray-200 rounded-md hover:bg-gray-300'
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className='w-12 text-center'>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartItemId, item.quantity + 1)
                              }
                              className='w-8 h-8 transition-colors bg-gray-200 rounded-md hover:bg-gray-300'
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className='text-sm text-red-600 transition-colors hover:text-red-700'
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='sticky p-6 bg-white rounded-lg shadow-md top-4'>
                <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                  Resumen del pedido
                </h2>

                <div className='space-y-2'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div className='pt-2 mt-2 border-t border-gray-200'>
                    <div className='flex justify-between text-lg font-semibold text-gray-900'>
                      <span>Total</span>
                      <span>${cartTotal.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  disabled={pricedItems.length === 0 || pricedItems.some(item => !item.product)}
                  className='w-full px-6 py-3 mt-6 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  Proceder al pago
                </button>

                <p className='mt-4 text-xs text-center text-gray-500'>
                  Los costos de envío se calcularán en el siguiente paso
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}