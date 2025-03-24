import React from 'react';
import { useGame, BetHistory as BetHistoryType } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const BetHistory: React.FC = () => {
  const { betHistory } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Function to get risk level colors
  const getRiskLevelStyle = (riskPercentage: number) => {
    if (riskPercentage < 30) {
      return { 
        bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-100', 
        text: isDarkMode ? 'text-green-400' : 'text-green-800' 
      };
    }
    if (riskPercentage < 70) {
      return { 
        bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100', 
        text: isDarkMode ? 'text-yellow-400' : 'text-yellow-800' 
      };
    }
    return { 
      bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-100', 
      text: isDarkMode ? 'text-red-400' : 'text-red-800' 
    };
  };
  
  if (betHistory.length === 0) {
    return (
      <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Bet History</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Place your first bet to see your history.</p>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Bet History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <th className="pb-2">Time</th>
              <th className="pb-2">Event</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Outcome</th>
              <th className="pb-2">Risk</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? 'text-white' : 'text-gray-800'}>
            {betHistory.map((bet: BetHistoryType) => {
              const riskStyle = getRiskLevelStyle(bet.riskPercentage);
              return (
                <tr key={bet.id} className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 text-xs">
                    {new Date(bet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2">{bet.eventName}</td>
                  <td className="py-2">${bet.betAmount.toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bet.outcome === 'win' 
                        ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                        : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                    }`}>
                      {bet.outcome === 'win' 
                        ? `Won $${bet.winAmount.toLocaleString()}`
                        : 'Lost'
                      }
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${riskStyle.bg} ${riskStyle.text}`}>
                      {bet.riskPercentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetHistory; 