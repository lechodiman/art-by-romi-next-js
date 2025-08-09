import { useState, useEffect } from 'react';
import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems } from '@/context/CartContext';
import { useCheckoutSubmission } from '@/hooks/useCheckoutSubmission';
import { formatRUT, formatChileanPhone } from '@/lib/chile-locations';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Product } from '@/types/Product';
import {
  CheckoutSteps,
  ContactInfoForm,
  ShippingAddressForm,
  OrderSummary,
  ContactInfoData,
  ShippingAddressData,
} from '@/components/checkout';
import { CheckoutFormValues, OrderData, ValidatedCartItem } from '@/types/checkout';

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

export default function Checkout() {
  const router = useRouter();
  const items = useCartItems();
  const { submitOrder } = useCheckoutSubmission();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CheckoutFormValues>>({});
  const [validatedItems, setValidatedItems] = useState<ValidatedCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    async function validateCart() {
      if (items.length === 0) {
        router.push('/carrito');
        return;
      }

      setIsValidating(true);

      try {
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
          const data = await response.json();
          const mappedItems: ValidatedCartItem[] = data.items.map(
            (item: PricedCartItem) => ({
              cartItemId: item.cartItemId,
              productId: item.productId,
              quantity: item.quantity,
              customizations: item.customizations,
              valid: !!item.product,
              calculatedPrice: item.calculatedPrice,
              product: item.product,
            })
          );

          if (mappedItems.some((item) => !item.valid)) {
            toast.error('Algunos productos no están disponibles');
            router.push('/carrito');
            return;
          }

          setValidatedItems(mappedItems);
          setCartTotal(data.total);
        } else {
          throw new Error('Error al validar el carrito');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al procesar el carrito';
        toast.error(errorMessage);
        router.push('/carrito');
      } finally {
        setIsValidating(false);
      }
    }

    validateCart();
  }, [items, router]);

  const handleContactInfoSubmit = (data: ContactInfoData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleShippingAddressSubmit = async (data: ShippingAddressData) => {
    const completeFormData = { ...formData, ...data } as CheckoutFormValues;

    const orderData: OrderData = {
      customer: {
        ...completeFormData,
        rut: formatRUT(completeFormData.rut),
        phone: formatChileanPhone(completeFormData.phone),
      },
      items: validatedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        customizations: item.customizations,
      })),
      createdAt: new Date().toISOString(),
    };

    await submitOrder(orderData);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (isValidating) {
    return (
      <main className='flex-grow bg-gray-100'>
        <section className='container px-5 mx-auto py-14'>
          <TypographyH1 className='text-center'>Checkout</TypographyH1>
          <div className='max-w-6xl mx-auto text-center'>
            <p className='text-gray-600'>Validando carrito...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto py-14'>
        <TypographyH1 className='mb-8 text-center'>Checkout</TypographyH1>

        <div className='max-w-6xl mx-auto'>
          <CheckoutSteps currentStep={currentStep} totalSteps={2} />

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              {currentStep === 1 ? (
                <ContactInfoForm
                  onSubmit={handleContactInfoSubmit}
                  defaultValues={formData}
                />
              ) : (
                <ShippingAddressForm
                  onSubmit={handleShippingAddressSubmit}
                  onBack={handleBack}
                  defaultValues={formData}
                />
              )}
            </div>

            <div className='lg:col-span-1'>
              <OrderSummary validatedItems={validatedItems} cartTotal={cartTotal} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
