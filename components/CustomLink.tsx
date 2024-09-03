import Link from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'default' | 'primary';
  popup?: boolean;
}

export function CustomLink({
  href,
  children,
  variant = 'default',
  popup = false,
}: CustomLinkProps) {
  const baseClasses =
    'inline-flex items-center tracking-widest uppercase transition-all duration-200';
  const variantClasses =
    variant === 'primary'
      ? 'bg-orange-100 text-orange-900 px-4 py-2 rounded-md hover:bg-orange-200'
      : 'text-red-800 hover:text-red-900';
  const popupClasses = popup ? 'hover:-translate-y-1' : '';

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${popupClasses}`}>
      {children}
    </Link>
  );
}
