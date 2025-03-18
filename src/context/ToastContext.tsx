import React, { createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) => {
    console.log(`Success: ${message}`);
  };

  const showError = (message: string) => {
    console.log(`Error: ${message}`);
  };

  const showInfo = (message: string) => {
    console.log(`Info: ${message}`);
  };

  const showWarning = (message: string) => {
    console.log(`Warning: ${message}`);
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 