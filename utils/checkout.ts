import { ValidatedCartItem } from '@/types/checkout';

export const getCustomizationText = (item: ValidatedCartItem): string => {
  const customizations = [];

  if (item.customizations?.extraPets) {
    customizations.push(
      `+${item.customizations.extraPets} mascota${item.customizations.extraPets === 1 ? '' : 's'}`
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