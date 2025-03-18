import React, { useState } from 'react';
import { BetEvent } from '../context/GameContext';
import { useGame } from '../context/GameContext';

interface BetCardProps {
  event: BetEvent;
}

const BetCard: React.FC<BetCardProps> = ({ event }) => {
  const { balance, placeBet, calculateRisk, currentPersona } = useGame();
  const [betAmount, setBetAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Calculate max bet based on persona
  const maxBetForPersona = Math.floor(balance * currentPersona.maxBetPercentage);
  
  // Calculate risk for current bet amount
  const riskPercentage = betAmount ? calculateRisk(event.id, parseFloat(betAmount)) : 0;
  
  // Format win chance as percentage
  const winChancePercent = (event.winChance * 100).toFixed(1);
  
  // Handle bet submission
  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    if (amount < event.minBet) {
      alert(`Minimum bet is $${event.minBet}`);
      return;
    }
    
    if (event.maxBet !== null && amount > event.maxBet) {
      alert(`Maximum bet is $${event.maxBet}`);
      return;
    }
    
    if (amount > balance) {
      alert('Not enough balance');
      return;
    }
    
    if (amount > maxBetForPersona) {
      alert(`${currentPersona.name} can only bet up to ${(currentPersona.maxBetPercentage * 100)}% of your balance ($${maxBetForPersona})`);
      return;
    }
    
    // Animate bet processing
    setIsProcessing(true);
    
    // Process bet after a short delay for animation
    setTimeout(() => {
      placeBet(event.id, amount);
      setBetAmount('');
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle quick bet buttons
  const handleQuickBet = (amount: number) => {
    const actualAmount = Math.min(amount, balance);
    setBetAmount(actualAmount.toString());
  };
  
  return (
    <div className={`border rounded-lg p-4 shadow-md ${isProcessing ? 'animate-pulse' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">{event.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          event.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
          event.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {event.riskLevel} Risk
        </span>
      </div>
      
      <div className="flex justify-between mb-3 text-sm">
        <div>
          <p className="text-gray-600">Win Chance</p>
          <p className="font-medium">{winChancePercent}%</p>
        </div>
        <div>
          <p className="text-gray-600">Multiplier</p>
          <p className="font-medium">{event.multiplier}x</p>
        </div>
        <div>
          <p className="text-gray-600">Min Bet</p>
          <p className="font-medium">${event.minBet}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor={`bet-amount-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1">
          Bet Amount
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
            $
          </span>
          <input
            id={`bet-amount-${event.id}`}
            type="number"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min={event.minBet}
            max={event.maxBet !== null ? Math.min(event.maxBet, balance) : balance}
          />
        </div>
      </div>
      
      {/* Quick bet buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          type="button"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded text-sm"
          onClick={() => handleQuickBet(100)}
          disabled={balance < 100}
        >
          $100
        </button>
        <button
          type="button"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded text-sm"
          onClick={() => handleQuickBet(500)}
          disabled={balance < 500}
        >
          $500
        </button>
        <button
          type="button"
          className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-2 rounded text-sm"
          onClick={() => handleQuickBet(balance)}
        >
          ALL-IN
        </button>
      </div>
      
      {/* Calculate potential win */}
      {betAmount && (
        <div className="flex justify-between text-sm mb-3">
          <div>
            <p className="text-gray-600">Potential Win</p>
            <p className="font-medium text-green-600">
              ${(parseFloat(betAmount) * event.multiplier).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Risk Level</p>
            <p className={`font-medium ${
              riskPercentage <= 30 ? 'text-green-600' :
              riskPercentage <= 70 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {riskPercentage}%
            </p>
          </div>
        </div>
      )}
      
      <button
        type="button"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        onClick={handlePlaceBet}
        disabled={isProcessing || !betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
      >
        {isProcessing ? 'Processing...' : 'Place Bet'}
      </button>
    </div>
  );
};

export default BetCard; 