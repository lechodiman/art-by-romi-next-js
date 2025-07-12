import { Product } from '@/types/Product';

interface CartItemPriceProps {
  product: Product;
  options: string[];
  petCount: string;
}

export function CartItemPrice({ product, options, petCount }: CartItemPriceProps) {
  const calculatePrice = () => {
    let totalPrice = product.price;

    // Add extra pet cost
    if (options.includes('extra-pet')) {
      const petPrices: { [key: string]: number } = {
        '1': 15000,
        '2': 20000,
      };
      totalPrice += petPrices[petCount] || 0;
    }

    // Add background cost
    if (options.includes('special-background')) {
      totalPrice += 5000;
    }

    // Add frame cost based on size
    if (options.includes('frame')) {
      const framePrices = {
        mini: 3000,
        medium: 5000,
        large: 7000,
      };
      totalPrice += framePrices[product.size] || framePrices.medium;
    }

    return totalPrice;
  };

  return (
    <span className="font-semibold text-gray-900">
      ${calculatePrice().toLocaleString('es-CL')}
    </span>
  );
}