import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';

const Header: React.FC = () => {
  const { balance } = useGame();
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [prevBalance, setPrevBalance] = useState<number>(balance);
  const [isWin, setIsWin] = useState<boolean>(false);
  
  // Check if the game is won or lost
  const isGameOver = balance <= 0;
  const isGameWon = balance >= 10000;
  
  // Animate balance changes
  useEffect(() => {
    if (balance !== prevBalance) {
      setIsWin(balance > prevBalance);
      setShowAnimation(true);
      
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
      
      setPrevBalance(balance);
      
      return () => clearTimeout(timer);
    }
  }, [balance, prevBalance]);
  
  return (
    <header className="bg-indigo-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Virtual Bet Simulator</h1>
            <p className="text-indigo-200 text-sm">Try your luck without the risk!</p>
          </div>
          
          <div className="text-right">
            <div className="mb-1">
              <p className="text-xs text-indigo-200">Current Balance</p>
              <div className="flex items-center justify-end">
                <span 
                  className={`text-3xl font-bold ${
                    showAnimation
                      ? isWin
                        ? 'text-green-300 animate-bounce'
                        : 'text-red-300 animate-shake'
                      : 'text-white'
                  }`}
                >
                  ${balance.toFixed(2)}
                </span>
                
                {showAnimation && (
                  <span className={`ml-2 text-sm font-medium ${isWin ? 'text-green-300' : 'text-red-300'}`}>
                    {isWin ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Goal progress */}
            <div className="w-48 bg-indigo-900 rounded-full h-2.5 mb-1">
              <div 
                className="bg-green-400 h-2.5 rounded-full" 
                style={{ width: `${Math.min((balance / 10000) * 100, 100)}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-indigo-200">
              Goal: ${balance.toFixed(2)} / $10,000.00
            </p>
            
            {/* Game status */}
            {isGameOver && (
              <div className="mt-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Game Over! You lost all your money.
              </div>
            )}
            
            {isGameWon && (
              <div className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Congratulations! You've reached $10,000!
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Add a keyframe animation for shake effect
const shakeAnimation = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;

// Add the animation to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shakeAnimation;
  document.head.appendChild(style);
}

export default Header; 