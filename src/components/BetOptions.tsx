import React, { useState, useEffect } from 'react';
import { useGame, BetEvent } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

interface BetOptionsProps {
  onSelectEvent?: (id: string) => void;
}

const BetOption: React.FC<{ 
  event: BetEvent, 
  selected: boolean, 
  onSelect: (id: string) => void 
}> = ({ event, selected, onSelect }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Map risk level to color classes
  const getRiskClasses = (riskLevel: 'Low' | 'Medium' | 'High') => {
    switch(riskLevel) {
      case 'Low': return { 
        bg: isDarkMode ? 'bg-green-900/40' : 'bg-green-100', 
        text: isDarkMode ? 'text-green-400' : 'text-green-800', 
        label: 'Low' 
      };
      case 'Medium': return { 
        bg: isDarkMode ? 'bg-yellow-900/40' : 'bg-yellow-100', 
        text: isDarkMode ? 'text-yellow-400' : 'text-yellow-800', 
        label: 'Medium' 
      };
      case 'High': return { 
        bg: isDarkMode ? 'bg-red-900/40' : 'bg-red-100', 
        text: isDarkMode ? 'text-red-400' : 'text-red-800', 
        label: 'High' 
      };
    }
  };
  
  const riskClasses = getRiskClasses(event.riskLevel);
  
  return (
    <div 
      className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg p-4 cursor-pointer transition border-2 ${
        selected ? 'border-primary-500' : isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } ${isDarkMode ? 'text-white' : 'text-gray-800'} shadow-sm`}
      onClick={() => onSelect(event.id)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{event.icon}</span>
          <h3 className="font-bold">{event.name}</h3>
        </div>
        <div className={`px-2 py-1 text-xs rounded-full ${riskClasses.bg}`}>
          <span className={riskClasses.text}>{riskClasses.label}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>
      </div>
      
      <div className="flex justify-between text-sm">
        <div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Multiplier</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{event.multiplier}x</p>
        </div>
        <div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Win Chance</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{Math.round(event.winChance * 100)}%</p>
        </div>
        <div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Min Bet</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>${event.minBet}</p>
        </div>
      </div>
    </div>
  );
};

const BetOptions: React.FC<BetOptionsProps> = ({ onSelectEvent }) => {
  const { betEvents } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [selectedEventId, setSelectedEventId] = useState<string>(betEvents[0]?.id || '');
  
  const handleSelectOption = (id: string) => {
    setSelectedEventId(id);
    if (onSelectEvent) {
      onSelectEvent(id);
    }
  };
  
  // Set the first bet event as selected initially
  useEffect(() => {
    if (betEvents.length > 0 && onSelectEvent) {
      onSelectEvent(selectedEventId);
    }
  }, [betEvents, onSelectEvent, selectedEventId]);
  
  return (
    <div className={isDarkMode ? '' : 'bg-white p-4 rounded-lg shadow-md'}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Bet Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {betEvents.map(event => (
          <BetOption 
            key={event.id} 
            event={event} 
            selected={selectedEventId === event.id}
            onSelect={handleSelectOption} 
          />
        ))}
      </div>
    </div>
  );
};

export default BetOptions; 