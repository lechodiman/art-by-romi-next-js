import { ValidatedCartItem } from '@/types/checkout';
import { getCustomizationText } from '@/utils/checkout';

interface OrderSummaryProps {
  validatedItems: ValidatedCartItem[];
  cartTotal: number;
}

export function OrderSummary({ validatedItems, cartTotal }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
      
      <div className="space-y-4 mb-4">
        {validatedItems.map((item) => {
          if (!item.product || !item.valid) return null;
          
          return (
            <div key={item.cartItemId} className="pb-4 border-b last:border-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  {getCustomizationText(item) && (
                    <p className="text-sm text-gray-600">{getCustomizationText(item)}</p>
                  )}
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${((item.calculatedPrice || 0) * item.quantity).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${cartTotal.toLocaleString('es-CL')}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Envío gratis incluido</p>
      </div>
    </div>
  );
}