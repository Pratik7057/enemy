import React from 'react';
import Logo from './Logo';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinnerClasses = fullScreen 
    ? 'flex flex-col h-screen w-full items-center justify-center bg-white dark:bg-gray-900' 
    : 'flex flex-col items-center justify-center py-12';
    
  return (
    <div className={spinnerClasses}>
      <div className="mb-8">
        <Logo className="text-2xl" />
      </div>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-secondary-500 border-l-transparent animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-4 border-t-secondary-500 border-r-primary-300 border-b-primary-500 border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
