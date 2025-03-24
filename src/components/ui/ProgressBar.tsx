import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const ProgressBar: React.FC = () => {
  const { balance } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Calculate progress percentage (1000 to 10000)
  const startAmount = 1000;
  const goalAmount = 10000;
  const progress = Math.min(Math.max((balance - startAmount) / (goalAmount - startAmount) * 100, 0), 100);
  
  return (
    <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Progress to Goal</h2>
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          ${balance.toLocaleString()} / ${goalAmount.toLocaleString()}
        </span>
      </div>
      
      <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-full ${progress >= 100 
            ? 'bg-green-500' 
            : progress >= 75 
              ? 'bg-blue-500' 
              : progress >= 50 
                ? 'bg-yellow-500' 
                : progress >= 25 
                  ? 'bg-orange-500' 
                  : 'bg-red-500'
          } transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Milestone markers */}
      <div className="flex justify-between mt-1 text-xs">
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>$1K Start</span>
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>$2.5K</span>
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>$5K</span>
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>$10K Goal</span>
      </div>
    </div>
  );
};

export default ProgressBar; 