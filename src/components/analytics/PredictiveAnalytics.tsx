import React, { useState } from 'react';
import { useGame, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import Tooltip from '../ui/Tooltip';

const PredictiveAnalytics: React.FC = () => {
  const { betHistory, balance } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [projectionPeriod, setProjectionPeriod] = useState<'10' | '25' | '50'>('25');

  // Skip rendering if not enough data
  if (betHistory.length < 5) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="predictive-analytics">
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="This section projects your future betting outcomes based on your current patterns and behavior. It helps you understand the long-term implications of your gambling habits.">
            Predictive Analytics
          </Tooltip>
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We need at least 5 bets to generate meaningful projections. Continue betting to see your future predictions.
        </p>
      </div>
    );
  }

  // Calculate key metrics from betting history
  const calculateMetrics = () => {
    // Win rate
    const wins = betHistory.filter(bet => bet.outcome === 'win').length;
    const winRate = betHistory.length > 0 ? wins / betHistory.length : 0;
    
    // Average bet size
    const avgBetSize = betHistory.reduce((sum, bet) => sum + bet.betAmount, 0) / betHistory.length;
    
    // Average risk level
    const avgRiskLevel = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length;
    
    // Recent trends (last 5 bets)
    const recentBets = [...betHistory].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5);
    
    const recentWinRate = recentBets.filter(bet => bet.outcome === 'win').length / recentBets.length;
    const recentAvgBetSize = recentBets.reduce((sum, bet) => sum + bet.betAmount, 0) / recentBets.length;
    const recentRiskLevel = recentBets.reduce((sum, bet) => sum + bet.riskPercentage, 0) / recentBets.length;
    
    // Trend factors (weighted more towards recent behavior)
    const winRateTrend = (recentWinRate - winRate) * 0.5;
    const betSizeTrend = ((recentAvgBetSize - avgBetSize) / avgBetSize) * 0.3;
    const riskTrend = ((recentRiskLevel - avgRiskLevel) / avgRiskLevel) * 0.2;
    
    return {
      winRate,
      avgBetSize,
      avgRiskLevel,
      winRateTrend,
      betSizeTrend,
      riskTrend,
      recentWinRate
    };
  };

  // Generate projections for different time periods
  const generateProjections = () => {
    const metrics = calculateMetrics();
    const numBets = parseInt(projectionPeriod);
    const projectedBets = [];
    
    let projectedBalance = balance;
    let currentWinRate = metrics.winRate;
    let currentBetSize = metrics.avgBetSize;
    let currentRiskLevel = metrics.avgRiskLevel;
    let totalWins = 0;

    // Apply small random variations to make projections more realistic
    const randomVariation = () => (Math.random() * 0.2) - 0.1; // -10% to +10%
    
    for (let i = 0; i < numBets; i++) {
      // Gradually adjust metrics based on trends
      currentWinRate = Math.max(0.01, Math.min(0.95, currentWinRate + (metrics.winRateTrend / numBets) + randomVariation() * 0.05));
      currentBetSize = Math.max(10, currentBetSize * (1 + (metrics.betSizeTrend / numBets) + randomVariation() * 0.1));
      currentRiskLevel = Math.max(5, Math.min(95, currentRiskLevel + (metrics.riskTrend / numBets) + randomVariation()));
      
      // Determine bet outcome
      const isWin = Math.random() < currentWinRate;
      if (isWin) totalWins++;
      
      // Calculate average return based on risk level (higher risk = higher potential return)
      const avgReturn = 1 + (currentRiskLevel / 100);
      
      // Update projectedBalance
      if (isWin) {
        projectedBalance += currentBetSize * avgReturn * 0.8; // 80% of theoretical return for realism
      } else {
        projectedBalance -= currentBetSize;
      }
      
      // Don't allow balance to go below 0
      projectedBalance = Math.max(0, projectedBalance);
      
      projectedBets.push({
        betNumber: i + 1,
        outcome: isWin ? 'win' : 'loss',
        balance: projectedBalance,
        betSize: currentBetSize,
        riskLevel: currentRiskLevel
      });
    }
    
    return {
      finalBalance: projectedBalance,
      projectedWinRate: totalWins / numBets,
      maxBalance: Math.max(...projectedBets.map(bet => bet.balance)),
      minBalance: Math.min(...projectedBets.map(bet => bet.balance)),
      averageBetSize: projectedBets.reduce((sum, bet) => sum + bet.betSize, 0) / numBets,
      averageRiskLevel: projectedBets.reduce((sum, bet) => sum + bet.riskLevel, 0) / numBets,
      bankruptcyRisk: projectedBalance < balance * 0.1 ? 'High' : projectedBalance < balance * 0.5 ? 'Medium' : 'Low',
      profitPotential: projectedBalance > balance * 1.5 ? 'High' : projectedBalance > balance * 1.1 ? 'Medium' : 'Low'
    };
  };

  const projections = generateProjections();
  const balanceChange = projections.finalBalance - balance;
  const balanceChangePercent = ((balanceChange / balance) * 100).toFixed(1);
  
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="predictive-analytics">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Tooltip content="This section projects your future betting outcomes based on your current patterns and behavior. It helps you understand the long-term implications of your gambling habits.">
          Predictive Analytics
        </Tooltip>
      </h2>
      
      <div className="flex items-center justify-between mb-6">
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Projecting outcomes for your next:
        </p>
        <div className="flex border rounded-md overflow-hidden">
          {(['10', '25', '50'] as const).map(period => (
            <button
              key={period}
              onClick={() => setProjectionPeriod(period)}
              className={`px-3 py-1 text-sm ${
                projectionPeriod === period
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period} bets
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Tooltip content="Projected final balance after the selected number of bets, based on your current betting patterns.">
              Projected Balance
            </Tooltip>
          </h3>
          <p className={`text-3xl font-bold ${
            balanceChange >= 0 
              ? isDarkMode ? 'text-green-400' : 'text-green-600'
              : isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            ${Math.round(projections.finalBalance).toLocaleString()}
          </p>
          <p className={`text-sm ${
            balanceChange >= 0 
              ? isDarkMode ? 'text-green-400' : 'text-green-600'
              : isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {balanceChange >= 0 ? '+' : ''}{balanceChangePercent}% from current
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Tooltip content="Projected win rate over the next set of bets, factoring in your recent performance trends.">
              Projected Win Rate
            </Tooltip>
          </h3>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {(projections.projectedWinRate * 100).toFixed(1)}%
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Current: {(calculateMetrics().winRate * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Tooltip content="An estimation of how likely you are to significantly deplete your bankroll based on your betting patterns.">
              Bankruptcy Risk
            </Tooltip>
          </h3>
          <p className={`text-3xl font-bold ${
            projections.bankruptcyRisk === 'Low' 
              ? isDarkMode ? 'text-green-400' : 'text-green-600'
              : projections.bankruptcyRisk === 'Medium' 
                ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                : isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {projections.bankruptcyRisk}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Min projected: ${Math.round(projections.minBalance).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="A breakdown of what might happen if you continue your current betting patterns.">
            What This Means
          </Tooltip>
        </h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          If you continue your current betting patterns for your next {projectionPeriod} bets:
        </p>
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
          <li>Your average bet size will be approximately ${Math.round(projections.averageBetSize).toLocaleString()}</li>
          <li>Your balance could {balanceChange >= 0 ? 'increase' : 'decrease'} by about {Math.abs(Math.round(balanceChange)).toLocaleString()} (${Math.round(projections.finalBalance).toLocaleString()} total)</li>
          <li>Your win rate is projected to be {(projections.projectedWinRate * 100).toFixed(1)}%</li>
          <li>Your average risk level will be {Math.round(projections.averageRiskLevel)}%</li>
          {projections.bankruptcyRisk !== 'Low' && (
            <li className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}>
              Warning: You have a {projections.bankruptcyRisk.toLowerCase()} risk of significantly depleting your bankroll
            </li>
          )}
          {projections.profitPotential === 'High' && (
            <li className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
              You have high profit potential if your win rate stays consistent
            </li>
          )}
        </ul>
      </div>
      
      <div>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recommendations</h3>
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {projections.averageBetSize > calculateMetrics().avgBetSize * 1.2 && (
            <li>Your bet sizes are projected to increase. Consider setting a maximum bet limit to maintain control.</li>
          )}
          {projections.averageRiskLevel > 50 && (
            <li>Your risk level is trending high. Consider choosing lower-risk betting options more frequently.</li>
          )}
          {projections.bankruptcyRisk !== 'Low' && (
            <li>To reduce bankruptcy risk, decrease your average bet size to no more than 5% of your bankroll.</li>
          )}
          {balanceChange < 0 && (
            <li>Based on your patterns, you're projected to lose money over time. Consider revising your strategy.</li>
          )}
          {projections.projectedWinRate < 0.3 && (
            <li>Your projected win rate is quite low. Focus on games where you've had higher success rates.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 