import { ReactNode } from 'react';

interface TypographyH1Props {
  children: ReactNode;
  className?: string;
}

export function TypographyH1({ children, className = '' }: TypographyH1Props) {
  return (
    <h1
      className={`font-serif text-5xl tracking-wide uppercase text-neutral-700 ${className}`}
    >
      {children}
    </h1>
  );
}
