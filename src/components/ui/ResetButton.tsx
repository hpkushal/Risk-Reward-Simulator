import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const ResetButton: React.FC = () => {
  const { resetGame, gameState } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Only show the reset button if the game is over (won or lost)
  // or make it less prominent if the game is still active
  const isGameOver = gameState === 'won' || gameState === 'lost';
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the game? This will reset your balance to $1000 and clear your bet history.')) {
      resetGame();
    }
  };

  if (!isGameOver) {
    return (
      <button
        onClick={handleReset}
        className={`px-4 py-2 rounded text-sm ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        Reset Game
      </button>
    );
  }

  return (
    <button
      onClick={handleReset}
      className={`px-6 py-3 rounded-lg font-bold text-white ${
        isDarkMode 
          ? 'bg-primary-600 hover:bg-primary-700' 
          : 'bg-primary-500 hover:bg-primary-600'
      } ${isGameOver ? 'animate-pulse-slow' : ''}`}
    >
      {isGameOver ? 'Play Again' : 'Reset Game'}
    </button>
  );
};

export default ResetButton; 