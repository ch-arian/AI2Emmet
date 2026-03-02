import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component with variants and sizes.
 *
 * Variants can be applied via className prop like: className="primary"
 * Sizes can be applied via className prop like: className="md"
 * Combined: className="primary lg"
 *
 * @example
 * <Button className="primary lg">Click me</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant, size, children, disabled, ...props }, ref) => {
    // Extract variant and size from className if not explicitly provided
    const classNames = className.split(' ');
    const detectedVariant = variant ||
      (classNames.includes('primary') ? 'primary' :
       classNames.includes('secondary') ? 'secondary' :
       classNames.includes('danger') ? 'danger' : 'primary');

    const detectedSize = size ||
      (classNames.includes('sm') ? 'sm' :
       classNames.includes('lg') ? 'lg' : 'md');

    // Base styles that apply to all buttons
    const baseStyles = [
      'rounded-md',
      'font-medium',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'transition-colors',
      'duration-150',
    ].join(' ');

    // Variant styles
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Disabled styles
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    // Filter out variant and size from user className
    const userClassName = classNames
      .filter(cls => !['primary', 'secondary', 'danger', 'sm', 'md', 'lg'].includes(cls))
      .join(' ');

    // Merge all styles
    const mergedClassName = twMerge(
      baseStyles,
      variantStyles[detectedVariant],
      sizeStyles[detectedSize],
      disabledStyles,
      userClassName
    );

    return (
      <button
        ref={ref}
        className={mergedClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
