import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      />
    </div>
  );
};

export default SearchBar;
