import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${errorStyles}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
