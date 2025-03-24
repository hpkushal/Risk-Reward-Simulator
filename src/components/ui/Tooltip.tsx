import React, { useState, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: 'narrow' | 'medium' | 'wide';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  width = 'medium' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const widthClasses = {
    narrow: 'w-48',
    medium: 'w-64',
    wide: 'w-80'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  // Arrow classes based on position
  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        {children}
        <span className={`ml-1 cursor-help text-xs inline-flex items-center justify-center h-4 w-4 rounded-full ${
          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
        }`}>
          ?
        </span>
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} ${widthClasses[width]} pointer-events-none`}>
          <div className={`relative ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-3 rounded-lg shadow-lg text-sm`}>
            {content}
            <div className={`absolute w-0 h-0 border-solid border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${arrowClasses[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 