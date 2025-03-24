import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const PersonaCard: React.FC = () => {
  const { currentPersona, balance, currentRisk, resetGame, gameState } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Map risk zones to their colors
  const getRiskZoneStyles = (zone: 'safe' | 'moderate' | 'danger') => {
    switch(zone) {
      case 'safe': 
        return {
          bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-100', 
          text: isDarkMode ? 'text-green-400' : 'text-green-800'
        };
      case 'moderate': 
        return {
          bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100', 
          text: isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
        };
      case 'danger': 
        return {
          bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-100', 
          text: isDarkMode ? 'text-red-400' : 'text-red-800'
        };
    }
  };
  
  const safeStyles = getRiskZoneStyles('safe');
  const moderateStyles = getRiskZoneStyles('moderate');
  const dangerStyles = getRiskZoneStyles('danger');
  
  // Get status message based on game state
  const getStatusMessage = () => {
    if (gameState === 'lost') return 'BANKRUPT!';
    if (gameState === 'won') return 'GOAL REACHED!';
    return '';
  };
  
  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} p-4`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Profile</h2>
          <button 
            onClick={resetGame}
            className={`text-xs px-2 py-1 rounded ${
              isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 
              'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {currentPersona.icon}
          </div>
          <div>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentPersona.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentPersona.description}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Balance</span>
          <span className={`text-sm ${
            balance > 1500 
              ? isDarkMode ? 'text-green-400' : 'text-green-600' 
              : balance < 500 
                ? isDarkMode ? 'text-red-400' : 'text-red-600'
                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {getStatusMessage()}
          </span>
        </div>
        <div className={`text-2xl font-bold ${
          balance > 1500 
            ? isDarkMode ? 'text-green-400' : 'text-green-600'
            : balance < 500 
              ? isDarkMode ? 'text-red-400' : 'text-red-600'
              : isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          ${balance.toLocaleString()}
        </div>
        <div className="mt-1 text-xs flex gap-1">
          <span className={`px-1 rounded ${safeStyles.bg} ${safeStyles.text}`}>Safe</span>
          <span className={`px-1 rounded ${moderateStyles.bg} ${moderateStyles.text}`}>Moderate</span>
          <span className={`px-1 rounded ${dangerStyles.bg} ${dangerStyles.text}`}>High Risk</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Level</span>
          <span className={`text-sm px-2 py-0.5 rounded-full ${
            currentRisk < 30
              ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
              : currentRisk < 70
                ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
          }`}>
            {currentRisk}%
          </span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Max Bet</span>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {(currentPersona.maxBetPercentage * 100)}% of Balance
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Personality</span>
          <div className="flex gap-1">
            {currentPersona.traits.map((trait: string, index: number) => (
              <span 
                key={index}
                className={`text-xs px-1 py-0.5 rounded ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaCard; 