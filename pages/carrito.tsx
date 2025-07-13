import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems, useCartActions } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types/Product';
import { getClient } from '@/sanity/lib/client';
import { productsByIdsQuery } from '@/sanity/lib/queries';
import Image from 'next/image';
import { CartItemPrice } from '@/components/cart/CartItemPrice';
import { EmptyCart } from '@/components/cart/EmptyCart';

export default function Carrito() {
  const router = useRouter();
  const items = useCartItems();
  const { removeFromCart, updateQuantity } = useCartActions();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const client = getClient();
        const productIds = items.map((item) => item.productId);
        const fetchedProducts = await client.fetch(productsByIdsQuery, {
          ids: productIds,
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [items]);

  const getProduct = (productId: string) => {
    return products.find((p) => p._id === productId);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const product = getProduct(item.productId);
      if (!product) return total;

      let itemPrice = product.price;

      // Add extra pet cost
      if (item.options.includes('extra-pet')) {
        const petPrices: { [key: string]: number } = {
          '1': 15000,
          '2': 20000,
        };
        itemPrice += petPrices[item.petCount] || 0;
      }

      // Add background cost
      if (item.options.includes('special-background')) {
        itemPrice += 5000;
      }

      // Add frame cost
      if (item.options.includes('frame')) {
        const framePrices = {
          mini: 3000,
          medium: 5000,
          large: 7000,
        };
        itemPrice += framePrices[product.size] || framePrices.medium;
      }

      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getCustomizationText = (item: any, product: Product) => {
    const customizations = [];

    if (item.options.includes('extra-pet') && item.petCount !== '0') {
      customizations.push(
        `+${item.petCount} mascota${item.petCount === '1' ? '' : 's'} adicional${item.petCount === '1' ? '' : 'es'}`
      );
    }

    if (item.options.includes('special-background')) {
      customizations.push('Fondo especial');
    }

    if (item.options.includes('frame')) {
      customizations.push(`Marco (${product.size})`);
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
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.cartItemId || item.productId}
                    className='p-6 bg-white rounded-lg shadow-md'
                  >
                    <div className='flex flex-col gap-4 sm:flex-row'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0 w-full h-40 sm:w-32 sm:h-40'>
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className='object-cover rounded-md'
                          sizes='(max-width: 640px) 100vw, 128px'
                        />
                      </div>

                      {/* Product Details */}
                      <div className='flex-grow space-y-2'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {product.name}
                        </h3>
                        <p className='text-sm text-gray-600'>{product.description}</p>
                        {item.options.length > 0 && (
                          <p className='text-sm text-zinc-600'>
                            {getCustomizationText(item, product)}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className='flex items-center gap-4 pt-2'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId || item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100'
                            >
                              -
                            </button>
                            <span className='w-12 text-center'>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId || item.productId,
                                  item.quantity + 1
                                )
                              }
                              className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100'
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(item.cartItemId || item.productId)
                            }
                            className='text-sm text-red-600 hover:text-red-800'
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className='text-right'>
                        <CartItemPrice
                          product={product}
                          options={item.options}
                          petCount={item.petCount}
                        />
                        {item.quantity > 1 && (
                          <p className='mt-1 text-sm text-gray-600'>x{item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='sticky p-6 bg-white rounded-lg shadow-md top-4'>
                <h2 className='mb-4 text-xl font-semibold'>Resumen del pedido</h2>

                <div className='mb-4 space-y-2'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Envío</span>
                    <span>Por calcular</span>
                  </div>
                </div>

                <div className='pt-4 mb-6 border-t'>
                  <div className='flex justify-between text-lg font-semibold'>
                    <span>Total</span>
                    <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className='w-full px-6 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600'
                >
                  Continuar compra
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
