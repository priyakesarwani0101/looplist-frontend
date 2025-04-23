import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'error' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'error' }) => {
  const isError = variant === 'error';
  
  return (
    <div className={`p-4 rounded-md ${
      isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
    }`}>
      <div className="flex items-center">
        {isError ? (
          <AlertCircle className="h-5 w-5 mr-2" />
        ) : (
          <CheckCircle className="h-5 w-5 mr-2" />
        )}
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}; 