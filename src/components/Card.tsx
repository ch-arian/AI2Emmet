import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'bg-white shadow-sm border border-slate-200 rounded-lg p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
