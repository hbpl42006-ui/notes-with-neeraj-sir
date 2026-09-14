import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700';
  const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
