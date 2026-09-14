import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ 
  type = 'success', 
  message, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: XCircle,
      iconColor: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
  };

  const { bg, border, icon: Icon, iconColor } = types[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ${bg} ${border} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
