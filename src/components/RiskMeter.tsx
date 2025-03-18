import React from 'react';
import { useGame } from '../context/GameContext';

interface RiskMeterProps {
  risk: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ risk }) => {
  const { currentPersona } = useGame();
  
  // Determine color based on risk level
  const getColor = () => {
    if (risk <= 30) return 'bg-green-500';
    if (risk <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Risk Meter</h3>
        <span className="font-bold text-xl">{risk}%</span>
      </div>
      
      {/* Meter background */}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        {/* Meter fill */}
        <div 
          className={`h-full ${getColor()} transition-all duration-500 ease-in-out`}
          style={{ width: `${risk}%` }}
        ></div>
      </div>
      
      {/* Current persona */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm font-medium">Current Persona:</span>
        <span className="font-bold">{currentPersona.name}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{currentPersona.description}</p>
    </div>
  );
};

export default RiskMeter; 