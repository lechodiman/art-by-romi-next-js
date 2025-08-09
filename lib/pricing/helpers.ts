import { CartItem } from './types';

/**
 * Normalize cart items by converting petCount to extraPets
 * The API receives petCount (total pets) but the calculator expects extraPets (additional pets beyond the first)
 */
export function normalizeCartItems(items: any[]): CartItem[] {
  return items.map((item, index) => ({
    cartItemId: item.cartItemId || `item-${index}`,
    productId: item.productId,
    quantity: item.quantity,
    customizations: item.customizations ? {
      ...item.customizations,
      extraPets: item.customizations.petCount 
        ? Math.max(0, item.customizations.petCount - 1) 
        : item.customizations.extraPets || 0,
      hasSpecialBackground: item.customizations.hasSpecialBackground || false,
      hasFrame: item.customizations.hasFrame || false,
      petNames: item.customizations.petNames,
      backgroundDescription: item.customizations.backgroundDescription,
    } : undefined
  }));
}

/**
 * Convert validated cart items to payment provider format
 */
export function toPaymentItems(validatedItems: any[]): any[] {
  return validatedItems
    .filter(item => item.valid)
    .map(item => {
      const petCount = (item.customizations?.extraPets || 0) + 1;
      return {
        id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.calculatedPrice,
        description: `${item.product.name}${
          petCount > 1 ? ` (${petCount} mascotas)` : ''
        }${item.customizations?.hasSpecialBackground ? ' con fondo especial' : ''}`
      };
    });
}