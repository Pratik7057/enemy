import React, { useState } from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  animated = true,
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = (e) => {
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };
  
  const baseClasses = 'relative overflow-hidden font-medium rounded-md focus:outline-none transition-all duration-300 ease-in-out';
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base'
  };
    const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
    secondary: 'bg-gradient-to-r from-secondary-600 to-primary-500 text-white hover:from-secondary-700 hover:to-primary-600 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
    warning: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 border border-gray-300',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0',
    outline: 'bg-transparent border border-primary-500 text-primary-600 hover:bg-primary-50',
    glass: 'backdrop-blur-md bg-white/30 border border-white/50 text-white hover:bg-white/40',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  const pressedClass = isPressed ? 'transform scale-95' : '';
  const animatedClass = animated ? 'transform hover:-translate-y-0.5 active:translate-y-0' : '';
  
  let classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${animatedClass} ${pressedClass} ${className}`;
  if (disabled || loading) {
    classes = `${classes} ${disabledClasses}`;
  }  
  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </div>
      ) : (
        <>
          {animated && variant !== 'link' && variant !== 'ghost' && (
            <span className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out transform ${isHovered ? 'opacity-100' : 'opacity-0'} ${variant === 'primary' || variant === 'success' || variant === 'danger' || variant === 'warning' || variant === 'gradient' ? 'bg-white/10' : 'bg-black/5'}`}></span>
          )}
          <div className={`flex items-center justify-center ${isPressed ? 'transform scale-95' : ''} transition-transform duration-150`}>
            {icon && iconPosition === 'left' && (
              <span className="mr-2">{icon}</span>
            )}
            <span className="relative z-10">{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="ml-2">{icon}</span>
            )}
          </div>
        </>
      )}
      
      {/* Ripple effect for primary variant */}
      {animated && variant === 'primary' && isPressed && (
        <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-0 rounded-full animate-ripple"></span>
      )}
    </button>
  );
};

export default Button;
