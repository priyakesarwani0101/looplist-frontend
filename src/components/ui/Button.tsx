import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: any;
  to?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    as,
    to,
    ...props 
  }, ref) => {
    const Component = as || 'button';
    const styles = cn(
      'relative inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      {
        'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300': variant === 'primary',
        'bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-600': variant === 'secondary',
        'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 disabled:bg-gray-100': variant === 'outline',
        'bg-transparent hover:bg-gray-100 text-gray-700 disabled:text-gray-400': variant === 'ghost',
        'bg-transparent underline-offset-4 hover:underline text-purple-600 disabled:text-gray-400': variant === 'link',
        'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300': variant === 'danger',
        'text-sm px-3 py-1.5': size === 'sm',
        'text-base px-4 py-2': size === 'md',
        'text-lg px-5 py-2.5': size === 'lg',
      },
      className
    );

    if (Component === Link) {
      return (
        <Link
          to={to!}
          className={styles}
          {...props}
        >
          <span className="flex items-center gap-2">
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </span>
        </Link>
      );
    }

    return (
      <button
        className={styles}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        <span className={cn('flex items-center gap-2', { 'opacity-0': isLoading })}>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';