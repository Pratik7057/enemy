import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  return (    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg border border-gray-100 dark:border-gray-700 ${className}`}>
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-800 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{subtitle}</p>}
        </div>
      )}
        <div className={`px-4 py-5 sm:p-6 dark:text-gray-100 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
