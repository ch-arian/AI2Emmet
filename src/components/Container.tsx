import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={twMerge('', className)} {...props}>
      {children}
    </div>
  );
}
