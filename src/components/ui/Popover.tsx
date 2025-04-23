import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </PopoverPrimitive.Root>
  );
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild,
}) => {
  return (
    <PopoverPrimitive.Trigger asChild={asChild}>
      {children}
    </PopoverPrimitive.Trigger>
  );
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={`bg-white rounded-lg shadow-lg border border-gray-200 p-2 ${className}`}
        sideOffset={5}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}; 