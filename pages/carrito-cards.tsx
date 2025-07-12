import { TypographyH1 } from '@/components/TypographyH1';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { Product } from '@/types/Product';
import { getClient } from '@/sanity/lib/client';
import { productsByIdsQuery } from '@/sanity/lib/queries';
import Image from 'next/image';
import { CartItemPrice } from '@/components/cart/CartItemPrice';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartVariationSwitcher } from '@/components/cart/CartVariationSwitcher';

export default function CarritoCards() {
  const { items, removeFromCart, updateQuantity } = useCart();
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
        const productIds = items.map(item => item.productId);
        const fetchedProducts = await client.fetch(productsByIdsQuery, { ids: productIds });
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
    return products.find(p => p._id === productId);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const product = getProduct(item.productId);
      if (!product) return total;

      let itemPrice = product.price;

      if (item.options.includes('extra-pet')) {
        const petPrices: { [key: string]: number } = {
          '1': 15000,
          '2': 20000,
        };
        itemPrice += petPrices[item.petCount] || 0;
      }

      if (item.options.includes('special-background')) {
        itemPrice += 5000;
      }

      if (item.options.includes('frame')) {
        const framePrices = {
          mini: 3000,
          medium: 5000,
          large: 7000,
        };
        itemPrice += framePrices[product.size] || framePrices.medium;
      }

      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCustomizationIcons = (item: any, product: Product) => {
    const icons = [];
    
    if (item.options.includes('extra-pet') && item.petCount !== '0') {
      icons.push(
        <div key="pet" className="flex items-center gap-1 text-xs bg-zinc-100 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          <span>+{item.petCount}</span>
        </div>
      );
    }
    
    if (item.options.includes('special-background')) {
      icons.push(
        <div key="bg" className="flex items-center gap-1 text-xs bg-zinc-100 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>Fondo</span>
        </div>
      );
    }
    
    if (item.options.includes('frame')) {
      icons.push(
        <div key="frame" className="flex items-center gap-1 text-xs bg-zinc-100 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span>Marco</span>
        </div>
      );
    }
    
    return icons;
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
    <main className='flex-grow bg-gray-100 pb-24 lg:pb-0'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
        
        <CartVariationSwitcher />
        
        <div className='max-w-5xl mx-auto'>
          {/* Cart Items Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {items.map((item, index) => {
              const product = getProduct(item.productId);
              if (!product) return null;

              return (
                <div key={index} className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
                  {/* Product Image */}
                  <div className='relative w-full pt-[125%]'>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className='absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all'
                      aria-label='Eliminar del carrito'
                    >
                      <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className='p-5 space-y-3'>
                    <h3 className='text-lg font-semibold text-gray-900 line-clamp-1'>{product.name}</h3>
                    
                    {/* Customization Icons */}
                    {item.options.length > 0 && (
                      <div className='flex gap-2 flex-wrap'>
                        {getCustomizationIcons(item, product)}
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className='flex items-center justify-between'>
                      <div className='text-lg font-bold'>
                        <CartItemPrice 
                          product={product} 
                          options={item.options} 
                          petCount={item.petCount} 
                        />
                      </div>
                      
                      {/* Compact Quantity Controls */}
                      <div className='flex items-center bg-gray-100 rounded-md'>
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className='px-3 py-1 hover:bg-gray-200 rounded-l-md transition-colors'
                        >
                          -
                        </button>
                        <span className='px-3 py-1 min-w-[2rem] text-center'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className='px-3 py-1 hover:bg-gray-200 rounded-r-md transition-colors'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Summary Bar */}
          <div className='fixed bottom-0 left-0 right-0 lg:relative lg:mt-12 bg-white border-t lg:border lg:rounded-lg shadow-lg p-4 lg:p-6'>
            <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-center sm:text-left'>
                <p className='text-sm text-gray-600'>Total del carrito</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${calculateSubtotal().toLocaleString('es-CL')}
                </p>
              </div>
              
              <button
                onClick={() => {
                  alert('Flujo de pago próximamente');
                }}
                className='w-full sm:w-auto px-8 py-3 text-white font-semibold transition-all rounded-md bg-zinc-700 hover:bg-zinc-600 hover:-translate-y-0.5 hover:shadow-lg'
              >
                Continuar compra
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}