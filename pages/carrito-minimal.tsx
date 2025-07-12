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

export default function CarritoMinimal() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

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

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getCustomizationSummary = (item: any, product: Product) => {
    const parts = [];
    
    if (item.options.includes('extra-pet') && item.petCount !== '0') {
      parts.push(`+${item.petCount} mascota${item.petCount === '1' ? '' : 's'}`);
    }
    
    if (item.options.includes('special-background')) {
      parts.push('Fondo especial');
    }
    
    if (item.options.includes('frame')) {
      parts.push('Con marco');
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Sin personalizaciones';
  };

  if (loading) {
    return (
      <main className='flex-grow bg-white'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
          <div className='max-w-3xl mx-auto text-center'>
            <p className='text-gray-600'>Cargando...</p>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className='flex-grow bg-white'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
          <EmptyCart />
        </section>
      </main>
    );
  }

  return (
    <main className='flex-grow bg-white'>
      {/* Sticky Header with Total */}
      <div className='sticky top-0 bg-white border-b z-10'>
        <div className='container mx-auto px-5 py-4'>
          <div className='flex items-center justify-between max-w-3xl mx-auto'>
            <div>
              <p className='text-sm text-gray-600'>{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</p>
              <p className='text-xl font-bold'>${calculateSubtotal().toLocaleString('es-CL')}</p>
            </div>
            <button
              onClick={() => {
                alert('Flujo de pago próximamente');
              }}
              className='px-6 py-2 text-white font-medium transition-colors rounded-full bg-zinc-700 hover:bg-zinc-600'
            >
              Continuar compra
            </button>
          </div>
        </div>
      </div>

      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
        
        <CartVariationSwitcher />
        
        <div className='max-w-3xl mx-auto'>
          {/* Minimal Cart Items */}
          <div className='divide-y'>
            {items.map((item, index) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              const isExpanded = expandedItems.has(index);

              return (
                <div key={index} className='py-6 first:pt-0 last:pb-0'>
                  <div className='flex gap-4'>
                    {/* Thumbnail Image */}
                    <div className='relative w-20 h-20 flex-shrink-0'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className='object-cover rounded-md'
                        sizes='80px'
                      />
                    </div>

                    {/* Product Info */}
                    <div className='flex-grow min-w-0'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-grow'>
                          <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
                          <p className='text-sm text-gray-600'>
                            {getCustomizationSummary(item, product)}
                          </p>
                        </div>
                        
                        {/* Price */}
                        <div className='text-right'>
                          <CartItemPrice 
                            product={product} 
                            options={item.options} 
                            petCount={item.petCount} 
                          />
                        </div>
                      </div>

                      {/* Minimal Controls */}
                      <div className='flex items-center gap-4 mt-3'>
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className='w-6 h-6 rounded-full border hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-2 text-sm'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className='w-6 h-6 rounded-full border hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => toggleExpanded(index)}
                          className='text-sm text-gray-600 hover:text-gray-900'
                        >
                          {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className='text-sm text-red-600 hover:text-red-800 ml-auto'
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className='mt-4 p-3 bg-gray-50 rounded-md text-sm'>
                          <p className='text-gray-700 mb-2'>{product.description}</p>
                          <div className='space-y-1'>
                            <p className='text-gray-600'>
                              <span className='font-medium'>Tamaño:</span> {product.size}
                            </p>
                            <p className='text-gray-600'>
                              <span className='font-medium'>Precio base:</span> ${product.price.toLocaleString('es-CL')}
                            </p>
                            {item.options.includes('extra-pet') && item.petCount !== '0' && (
                              <p className='text-gray-600'>
                                <span className='font-medium'>Mascotas adicionales:</span> {item.petCount}
                              </p>
                            )}
                            {item.options.includes('special-background') && (
                              <p className='text-gray-600'>
                                <span className='font-medium'>Fondo especial:</span> +$5.000
                              </p>
                            )}
                            {item.options.includes('frame') && (
                              <p className='text-gray-600'>
                                <span className='font-medium'>Marco:</span> +${
                                  product.size === 'mini' ? '3.000' : 
                                  product.size === 'large' ? '7.000' : '5.000'
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Summary */}
          <div className='mt-12 pt-8 border-t'>
            <div className='space-y-3 text-right'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'artículo' : 'artículos'})</span>
                <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Envío</span>
                <span>Por calcular</span>
              </div>
              <div className='flex justify-between text-lg font-bold pt-3 border-t'>
                <span>Total estimado</span>
                <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}