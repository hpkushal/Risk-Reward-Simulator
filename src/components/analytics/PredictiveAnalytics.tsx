/**
 * PredictiveAnalytics Component
 * 
 * This component provides sophisticated risk analysis and future projections
 * based on the user's betting history and patterns. It uses statistical methods
 * to predict potential outcomes and risk levels for future betting activity.
 * 
 * Features:
 * - Monte Carlo simulation for future balance projections
 * - Value at Risk (VaR) calculations 
 * - Volatility analysis
 * - Risk breakdown visualization
 * - Personalized betting recommendations
 * 
 * @module components/analytics/PredictiveAnalytics
 */
import React, { useState } from 'react';
import { useGame, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import Tooltip from '../ui/Tooltip';

/**
 * Predictive Analytics Component
 * 
 * @returns {JSX.Element} The rendered predictive analytics component
 */
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

  /**
   * Calculates key metrics from betting history
   * 
   * @returns {Object} Object containing metrics like win rate, average bet size, risk levels, and trends
   */
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
    
    // Calculate betting frequency (average days between bets)
    let bettingFrequency = 0;
    if (betHistory.length > 1) {
      const sortedBets = [...betHistory].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      const timeGaps = [];
      for (let i = 1; i < sortedBets.length; i++) {
        const gap = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60 * 60 * 24); // in days
        timeGaps.push(gap);
      }
      
      bettingFrequency = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
    }
    
    // Calculate bet sizing strategy (standard deviation of bet size relative to balance)
    const betSizeRatios = betHistory.map(bet => bet.betAmount / bet.balanceAfter);
    const avgBetSizeRatio = betSizeRatios.reduce((sum, ratio) => sum + ratio, 0) / betSizeRatios.length;
    const betSizeStdDev = Math.sqrt(
      betSizeRatios.reduce((sum, ratio) => sum + Math.pow(ratio - avgBetSizeRatio, 2), 0) / betSizeRatios.length
    );
    
    return {
      winRate,
      avgBetSize,
      avgRiskLevel,
      winRateTrend,
      betSizeTrend,
      riskTrend,
      recentWinRate,
      bettingFrequency,
      avgBetSizeRatio,
      betSizeStdDev
    };
  };

  /**
   * Generates future projections using Monte Carlo simulation
   * 
   * This function simulates future betting outcomes based on:
   * - Historical win rates with trend adjustments
   * - Betting size patterns with random variations
   * - Risk level trends
   * 
   * It calculates several risk metrics including:
   * - Value at Risk (VaR)
   * - Balance volatility
   * - Bankruptcy risk scoring
   * 
   * @returns {Object} Comprehensive projection results and risk assessment
   */
  const generateProjections = () => {
    const metrics = calculateMetrics();
    const numBets = parseInt(projectionPeriod);
    const projectedBets = [];
    
    let projectedBalance = balance;
    let currentWinRate = metrics.winRate;
    let currentBetSize = metrics.avgBetSize;
    let currentRiskLevel = metrics.avgRiskLevel;
    let totalWins = 0;
    let balanceHistory = [projectedBalance];

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
      balanceHistory.push(projectedBalance);
      
      projectedBets.push({
        betNumber: i + 1,
        outcome: isWin ? 'win' : 'loss',
        balance: projectedBalance,
        betSize: currentBetSize,
        riskLevel: currentRiskLevel
      });
    }
    
    // Calculate standard deviation of balance
    const avgBalance = balanceHistory.reduce((sum, bal) => sum + bal, 0) / balanceHistory.length;
    const balanceStdDev = Math.sqrt(
      balanceHistory.reduce((sum, bal) => sum + Math.pow(bal - avgBalance, 2), 0) / balanceHistory.length
    );
    
    // Calculate Value at Risk (VaR) - 95% confidence level
    // Sort balance changes to find the 5th percentile
    const balanceChanges = [];
    for (let i = 1; i < balanceHistory.length; i++) {
      balanceChanges.push(balanceHistory[i] - balanceHistory[i-1]);
    }
    balanceChanges.sort((a, b) => a - b);
    const valueAtRisk = Math.abs(balanceChanges[Math.floor(balanceChanges.length * 0.05)]);
    
    // Calculate minimum projected balance
    const minBalance = Math.min(...balanceHistory);
    
    // Calculate continuous risk score (0-100)
    // Factors to consider:
    // 1. Final balance ratio (30%)
    const finalBalanceRatio = projectedBalance / balance;
    const finalBalanceScore = Math.max(0, Math.min(30, 30 * (1 - finalBalanceRatio)));
    
    // 2. Minimum balance ratio (25%)
    const minBalanceRatio = minBalance / balance;
    const minBalanceScore = Math.max(0, Math.min(25, 25 * (1 - minBalanceRatio)));
    
    // 3. Volatility score (20%)
    const volatilityRatio = balanceStdDev / avgBalance;
    const volatilityScore = Math.min(20, 20 * volatilityRatio);
    
    // 4. VaR score (15%)
    const varRatio = valueAtRisk / avgBalance;
    const varScore = Math.min(15, 15 * varRatio);
    
    // 5. Bet sizing strategy (10%)
    // Higher std dev in bet sizing indicates more erratic betting (higher risk)
    const betSizingScore = Math.min(10, 10 * metrics.betSizeStdDev * 5);
    
    // Calculate total risk score (0-100)
    const riskScore = finalBalanceScore + minBalanceScore + volatilityScore + varScore + betSizingScore;
    
    // Map continuous score to risk categories for display purposes
    let bankruptcyRiskCategory;
    if (riskScore < 20) bankruptcyRiskCategory = 'Very Low';
    else if (riskScore < 40) bankruptcyRiskCategory = 'Low';
    else if (riskScore < 60) bankruptcyRiskCategory = 'Medium';
    else if (riskScore < 80) bankruptcyRiskCategory = 'High';
    else bankruptcyRiskCategory = 'Very High';
    
    return {
      finalBalance: projectedBalance,
      projectedWinRate: totalWins / numBets,
      maxBalance: Math.max(...balanceHistory),
      minBalance: minBalance,
      averageBetSize: projectedBets.reduce((sum, bet) => sum + bet.betSize, 0) / numBets,
      averageRiskLevel: projectedBets.reduce((sum, bet) => sum + bet.riskLevel, 0) / numBets,
      bankruptcyRiskScore: riskScore,
      bankruptcyRiskCategory: bankruptcyRiskCategory,
      balanceVolatility: balanceStdDev / avgBalance,
      valueAtRisk: valueAtRisk,
      profitPotential: projectedBalance > balance * 1.5 ? 'High' : projectedBalance > balance * 1.1 ? 'Medium' : 'Low',
      riskBreakdown: {
        finalBalanceContribution: finalBalanceScore,
        minBalanceContribution: minBalanceScore,
        volatilityContribution: volatilityScore,
        varContribution: varScore,
        betSizingContribution: betSizingScore
      }
    };
  };

  const projections = generateProjections();
  const balanceChange = projections.finalBalance - balance;
  const balanceChangePercent = ((balanceChange / balance) * 100).toFixed(1);
  
  /**
   * Returns the appropriate color class based on risk score
   * 
   * @param {number} score - Risk score (0-100)
   * @returns {string} Tailwind CSS color class
   */
  const getRiskScoreColor = (score: number) => {
    if (score < 20) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score < 40) return isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (score < 60) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (score < 80) return isDarkMode ? 'text-orange-400' : 'text-orange-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };
  
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
            <Tooltip content="A sophisticated risk assessment based on multiple factors including minimum balance, volatility, Value at Risk (VaR), and betting patterns.">
              Bankruptcy Risk
            </Tooltip>
          </h3>
          <p className={`text-3xl font-bold ${getRiskScoreColor(projections.bankruptcyRiskScore)}`}>
            {projections.bankruptcyRiskCategory}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Risk Score: {Math.round(projections.bankruptcyRiskScore)}/100
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
          <li>Your lowest balance point is projected to be ${Math.round(projections.minBalance).toLocaleString()}</li>
          <li>Your balance volatility will be {(projections.balanceVolatility * 100).toFixed(1)}%</li>
          {projections.bankruptcyRiskScore > 60 && (
            <li className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
              Warning: You have a {projections.bankruptcyRiskCategory.toLowerCase()} risk ({Math.round(projections.bankruptcyRiskScore)}/100) of significantly depleting your bankroll
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
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
          {projections.riskBreakdown.finalBalanceContribution > 15 && (
            <li>Your final balance projection is concerning. Consider reducing your bet sizes or choosing events with higher win probabilities.</li>
          )}
          {projections.riskBreakdown.minBalanceContribution > 15 && (
            <li>Your balance may drop dangerously low during this period. Set a stop-loss limit of ${Math.round(balance * 0.5).toLocaleString()} to protect yourself.</li>
          )}
          {projections.riskBreakdown.volatilityContribution > 12 && (
            <li>Your betting pattern shows high volatility. Space out your bets and maintain more consistent bet sizes to reduce swings.</li>
          )}
          {projections.riskBreakdown.varContribution > 10 && (
            <li>Your Value at Risk is high. Avoid placing bets that risk more than ${Math.round(balance * 0.1).toLocaleString()} at once.</li>
          )}
          {projections.riskBreakdown.betSizingContribution > 7 && (
            <li>Your bet sizing strategy is inconsistent. Consider using the 5% rule: never bet more than 5% of your bankroll on a single bet.</li>
          )}
          {projections.averageBetSize > calculateMetrics().avgBetSize * 1.2 && (
            <li>Your bet sizes are projected to increase. Consider setting a maximum bet limit to maintain control.</li>
          )}
          {projections.bankruptcyRiskScore > 70 && (
            <li className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
              <strong>High Risk Alert:</strong> Your current strategy has a {Math.round(projections.bankruptcyRiskScore)}% risk of substantial losses. Take immediate action to adjust your approach.
            </li>
          )}
          {projections.bankruptcyRiskScore < 30 && balanceChange > 0 && (
            <li className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
              Your current strategy shows excellent balance between risk and reward. Continue with this disciplined approach.
            </li>
          )}
        </ul>
      </div>
      
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="A detailed breakdown of factors contributing to your bankruptcy risk assessment.">
            Risk Assessment Breakdown
          </Tooltip>
        </h3>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Final Balance Impact</span>
              <span className={`text-sm ${getRiskScoreColor(projections.riskBreakdown.finalBalanceContribution * 3.33)}`}>
                {Math.round(projections.riskBreakdown.finalBalanceContribution)} pts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`h-1.5 rounded-full ${getRiskScoreColor(projections.riskBreakdown.finalBalanceContribution * 3.33)}`} 
                  style={{ width: `${(projections.riskBreakdown.finalBalanceContribution / 30) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Minimum Balance Impact</span>
              <span className={`text-sm ${getRiskScoreColor(projections.riskBreakdown.minBalanceContribution * 4)}`}>
                {Math.round(projections.riskBreakdown.minBalanceContribution)} pts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`h-1.5 rounded-full ${getRiskScoreColor(projections.riskBreakdown.minBalanceContribution * 4)}`} 
                  style={{ width: `${(projections.riskBreakdown.minBalanceContribution / 25) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Volatility Impact</span>
              <span className={`text-sm ${getRiskScoreColor(projections.riskBreakdown.volatilityContribution * 5)}`}>
                {Math.round(projections.riskBreakdown.volatilityContribution)} pts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`h-1.5 rounded-full ${getRiskScoreColor(projections.riskBreakdown.volatilityContribution * 5)}`} 
                  style={{ width: `${(projections.riskBreakdown.volatilityContribution / 20) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Value at Risk (VaR)</span>
              <span className={`text-sm ${getRiskScoreColor(projections.riskBreakdown.varContribution * 6.67)}`}>
                {Math.round(projections.riskBreakdown.varContribution)} pts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`h-1.5 rounded-full ${getRiskScoreColor(projections.riskBreakdown.varContribution * 6.67)}`} 
                  style={{ width: `${(projections.riskBreakdown.varContribution / 15) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Betting Strategy Impact</span>
              <span className={`text-sm ${getRiskScoreColor(projections.riskBreakdown.betSizingContribution * 10)}`}>
                {Math.round(projections.riskBreakdown.betSizingContribution)} pts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className={`h-1.5 rounded-full ${getRiskScoreColor(projections.riskBreakdown.betSizingContribution * 10)}`} 
                  style={{ width: `${(projections.riskBreakdown.betSizingContribution / 10) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="A breakdown of what might happen if you continue your current betting patterns.">
            Advanced Metrics
          </Tooltip>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Tooltip content="The lowest your balance is projected to reach during this simulation.">
                Minimum Projected Balance:
              </Tooltip>
            </p>
            <p className={`font-bold ${getRiskScoreColor(100 - (projections.minBalance / balance) * 100)}`}>
              ${Math.round(projections.minBalance).toLocaleString()} ({((projections.minBalance / balance) * 100).toFixed(1)}% of current)
            </p>
          </div>
          
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Tooltip content="A measure of how much your balance fluctuates during the simulation. Higher values indicate more unpredictable outcomes.">
                Balance Volatility:
              </Tooltip>
            </p>
            <p className={`font-bold ${getRiskScoreColor(projections.balanceVolatility * 100)}`}>
              {(projections.balanceVolatility * 100).toFixed(1)}%
            </p>
          </div>
          
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Tooltip content="Value at Risk (VaR) - The maximum amount you might lose in a single bet with 95% confidence.">
                Value at Risk (VaR):
              </Tooltip>
            </p>
            <p className={`font-bold ${getRiskScoreColor((projections.valueAtRisk / balance) * 100)}`}>
              ${Math.round(projections.valueAtRisk).toLocaleString()} ({((projections.valueAtRisk / balance) * 100).toFixed(1)}% of balance)
            </p>
          </div>
          
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Tooltip content="Your projected average bet size as a percentage of your balance.">
                Avg. Bet Size:
              </Tooltip>
            </p>
            <p className={`font-bold ${getRiskScoreColor((projections.averageBetSize / projections.finalBalance) * 100)}`}>
              ${Math.round(projections.averageBetSize).toLocaleString()} ({((projections.averageBetSize / projections.finalBalance) * 100).toFixed(1)}% of balance)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 