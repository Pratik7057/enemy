import React, { useState } from 'react';
import { 
  ExclamationCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Input = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
  icon,
  className = '',
  inputClassName = '',
  labelClassName = '',
  disabled = false,
  required = false,
  startAdornment,
  endAdornment,
  fullWidth = false,
  variant = 'default', // default, outlined, filled, borderless
  size = 'md', // sm, md, lg
  helpText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  let inputSize = '';
  switch(size) {
    case 'sm': 
      inputSize = 'py-1 px-3 text-sm';
      break;
    case 'lg': 
      inputSize = 'py-3 px-4 text-lg';
      break;
    default: 
      inputSize = 'py-2 px-3 text-base';
  }
  
  let inputVariant = '';
  switch(variant) {
    case 'outlined':
      inputVariant = 'bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 rounded-lg';
      break;
    case 'filled':
      inputVariant = 'bg-gray-100 dark:bg-gray-700 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg';
      break;
    case 'borderless':
      inputVariant = 'bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 rounded-none px-0';
      break;
    default:
      inputVariant = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg';
  }

  // Base input classes  
  const baseInputClasses = `block w-full ${inputSize} ${inputVariant} transition-all duration-200 ease-in-out 
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2'} 
    ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500' : 
      success ? 'border-green-500 dark:border-green-400 focus:ring-green-500/20 focus:border-green-500' : 
      'focus:ring-primary-500/20 focus:border-primary-500'}
    ${startAdornment ? 'pl-10' : ''}
    ${(endAdornment || type === 'password' || type === 'search') ? 'pr-10' : ''}
    ${inputClassName}`;
    
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 transition-colors ${
            error ? 'text-red-600 dark:text-red-400' : 
            success ? 'text-green-600 dark:text-green-400' : 
            'text-gray-700 dark:text-gray-300'} ${labelClassName}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{startAdornment}</span>
          </div>
        )}
        
        {icon && !startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{icon}</span>
          </div>
        )}
        
        {type === 'search' && !startAdornment && !icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-300 text-red-900' : 'border-gray-300 dark:border-gray-600'
          } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
            disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
