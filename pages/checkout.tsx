import { useState } from 'react';
import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems } from '@/context/CartContext';
import { useCartValidation } from '@/hooks/useCartValidation';
import { useCheckoutSubmission } from '@/hooks/useCheckoutSubmission';
import { formatRUT, formatChileanPhone } from '@/lib/chile-locations';
import {
  CheckoutSteps,
  ContactInfoForm,
  ShippingAddressForm,
  OrderSummary,
  ContactInfoData,
  ShippingAddressData
} from '@/components/checkout';
import { CheckoutFormValues, OrderData } from '@/types/checkout';

export default function Checkout() {
  const items = useCartItems();
  const { validatedItems, cartTotal, isValidating } = useCartValidation(items);
  const { submitOrder } = useCheckoutSubmission();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CheckoutFormValues>>({});

  const handleContactInfoSubmit = (data: ContactInfoData) => {
    setFormData(prev => ({ ...prev, ...data }));
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
      items: validatedItems.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        quantity: item.quantity,
        price: item.calculatedPrice,
        customizations: item.customizations,
      })),
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    await submitOrder(orderData);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (isValidating) {
    return (
      <main className="flex-grow bg-gray-100">
        <section className="container px-5 mx-auto py-14">
          <TypographyH1 className="text-center">Checkout</TypographyH1>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600">Validando carrito...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-100">
      <section className="container px-5 mx-auto py-14">
        <TypographyH1 className="text-center mb-8">Checkout</TypographyH1>

        <div className="max-w-6xl mx-auto">
          <CheckoutSteps currentStep={currentStep} totalSteps={2} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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

            <div className="lg:col-span-1">
              <OrderSummary 
                validatedItems={validatedItems}
                cartTotal={cartTotal}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}