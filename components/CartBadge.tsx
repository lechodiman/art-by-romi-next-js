'use client';

import { useCartItems } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const items = useCartItems();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <Badge className={className}>
      {totalItems}
    </Badge>
  );
}