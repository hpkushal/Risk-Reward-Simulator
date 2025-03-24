import React from 'react';
import { useGame, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const FinancialMetrics: React.FC = () => {
  const { betHistory, balance } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Skip rendering if not enough data
  if (betHistory.length < 3) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Financial Metrics</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Place at least 3 bets to see your financial metrics.
        </p>
      </div>
    );
  }
  
  // Sort bets by timestamp
  const sortedBets = [...betHistory].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Calculate win/loss ratio
  const wins = betHistory.filter(bet => bet.outcome === 'win').length;
  const losses = betHistory.filter(bet => bet.outcome === 'loss').length;
  const winLossRatio = losses === 0 ? wins : (wins / losses).toFixed(2);
  
  // Calculate total won/lost
  const totalWon = betHistory
    .filter(bet => bet.outcome === 'win')
    .reduce((sum, bet) => sum + bet.winAmount, 0);
    
  const totalLost = betHistory
    .filter(bet => bet.outcome === 'loss')
    .reduce((sum, bet) => sum + bet.betAmount, 0);
  
  // Calculate ROI
  const totalInvested = betHistory.reduce((sum, bet) => sum + bet.betAmount, 0);
  const netProfit = totalWon - totalLost;
  const roi = totalInvested > 0 ? ((netProfit / totalInvested) * 100).toFixed(2) : '0.00';
  
  // Analyze stake sizing patterns
  const stakePercentages = betHistory.map(bet => (bet.betAmount / bet.balanceAfter) * 100);
  const avgStakePercentage = stakePercentages.reduce((sum, pct) => sum + pct, 0) / stakePercentages.length;
  const maxStakePercentage = Math.max(...stakePercentages);
  
  // Calculate maximum drawdown
  const calculateMaxDrawdown = (betHistory: BetHistory[]): number => {
    if (betHistory.length === 0) return 0;
    
    let maxBalance = sortedBets[0].balanceAfter;
    let maxDrawdown = 0;
    
    for (const bet of sortedBets) {
      if (bet.balanceAfter > maxBalance) {
        maxBalance = bet.balanceAfter;
      }
      
      const drawdown = ((maxBalance - bet.balanceAfter) / maxBalance) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  };
  
  const maxDrawdown = calculateMaxDrawdown(sortedBets);
  
  // Calculate consecutive wins/losses
  const calculateStreaks = (betHistory: BetHistory[]): { maxWinStreak: number, maxLossStreak: number, currentStreak: number } => {
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let currentStreak = 0;
    
    for (const bet of sortedBets) {
      if (bet.outcome === 'win') {
        currentWinStreak++;
        currentLossStreak = 0;
        currentStreak = currentWinStreak;
        if (currentWinStreak > maxWinStreak) {
          maxWinStreak = currentWinStreak;
        }
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        currentStreak = -currentLossStreak;
        if (currentLossStreak > maxLossStreak) {
          maxLossStreak = currentLossStreak;
        }
      }
    }
    
    return { maxWinStreak, maxLossStreak, currentStreak };
  };
  
  const streaks = calculateStreaks(sortedBets);
  
  // Calculate recovery patterns after losses
  const calculateRecoveryRate = (betHistory: BetHistory[]): number => {
    let lossFollowedByWinCount = 0;
    let totalLossesFollowedByAnyBet = 0;
    
    for (let i = 0; i < sortedBets.length - 1; i++) {
      if (sortedBets[i].outcome === 'loss') {
        totalLossesFollowedByAnyBet++;
        if (sortedBets[i+1].outcome === 'win') {
          lossFollowedByWinCount++;
        }
      }
    }
    
    return totalLossesFollowedByAnyBet > 0 
      ? (lossFollowedByWinCount / totalLossesFollowedByAnyBet) * 100 
      : 0;
  };
  
  const recoveryRate = calculateRecoveryRate(sortedBets);
  
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Financial Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Win/Loss Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Win/Loss Ratio</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{winLossRatio}</p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Win Rate</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {betHistory.length > 0 ? ((wins / betHistory.length) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Profit & Loss</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net Profit</p>
              <p className={`font-semibold text-lg ${
                netProfit >= 0 
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                ${netProfit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ROI</p>
              <p className={`font-semibold text-lg ${
                parseFloat(roi) >= 0 
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {roi}%
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Stake Sizing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Bet Size</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {avgStakePercentage.toFixed(1)}% of bankroll
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Largest Bet</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {maxStakePercentage.toFixed(1)}% of bankroll
              </p>
            </div>
          </div>
          {maxStakePercentage > 30 && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Your largest bets are quite high relative to your bankroll. Consider reducing your maximum stake size.
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Risk Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Max Drawdown</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {maxDrawdown.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recovery Rate</p>
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {recoveryRate.toFixed(1)}%
              </p>
            </div>
          </div>
          {maxDrawdown > 30 && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Your maximum drawdown is significant. Consider implementing stricter stop-loss strategies.
            </p>
          )}
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Winning & Losing Streaks</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best Streak</p>
            <p className={`font-semibold text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {streaks.maxWinStreak} wins
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Worst Streak</p>
            <p className={`font-semibold text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {streaks.maxLossStreak} losses
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
            <p className={`font-semibold text-lg ${
              streaks.currentStreak > 0 
                ? isDarkMode ? 'text-green-400' : 'text-green-600'
                : streaks.currentStreak < 0 
                  ? isDarkMode ? 'text-red-400' : 'text-red-600'
                  : isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {streaks.currentStreak > 0 
                ? `${streaks.currentStreak} wins` 
                : streaks.currentStreak < 0 
                  ? `${Math.abs(streaks.currentStreak)} losses`
                  : '0'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recommendations</h3>
        <ul className={`text-sm list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {avgStakePercentage > 15 && (
            <li>Consider reducing your average bet size to below 10% of your bankroll for better longevity</li>
          )}
          {maxDrawdown > 25 && (
            <li>Implement stop-loss limits to prevent significant drawdowns</li>
          )}
          {parseFloat(roi) < 0 && (
            <li>Review your betting strategy - you're currently losing money overall</li>
          )}
          {streaks.maxLossStreak > 3 && (
            <li>Consider taking a break after 3 consecutive losses to reset your mindset</li>
          )}
          {recoveryRate < 30 && wins > 0 && losses > 0 && (
            <li>Your recovery rate after losses is low. Try a different approach after experiencing a loss</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FinancialMetrics; 