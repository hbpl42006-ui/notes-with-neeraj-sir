import React from 'react';
import { FolderOpen, FileText, Calendar, AlertCircle } from 'lucide-react';

const EmptyState = ({ 
  icon = 'folder',
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action = null
}) => {
  const icons = {
    folder: FolderOpen,
    file: FileText,
    calendar: Calendar,
    alert: AlertCircle,
  };

  const Icon = icons[icon] || FolderOpen;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 dark:bg-gray-800">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-sm dark:text-gray-400">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
