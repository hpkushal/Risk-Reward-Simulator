import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import Tooltip from '../ui/Tooltip';

// Responsible gambling benchmarks
const responsibleBenchmarks = {
  maxSessionDuration: 60, // minutes
  maxBankrollPercentage: 10, // percent per bet
  maxRiskLevel: 40, // percent
  minBreakFrequency: 4, // bets before taking a break
  minDaysPerWeek: 3, // days without betting per week
  winRateExpectation: 0.45, // expected win rate (slightly below 0.5 due to house edge)
  riskDiversification: 0.3, // minimum distribution across different game types
  chaseFrequency: 0.15, // maximum percentage of bets that chase losses
};

const ComparativeAnalytics: React.FC = () => {
  const { betHistory, betEvents } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Skip rendering if not enough data
  if (betHistory.length < 5) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="comparative-analytics">
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="This section compares your betting habits with responsible gambling benchmarks to help you understand where your behavior might be risky.">
            Comparative Analytics
          </Tooltip>
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We need at least 5 bets to generate meaningful comparisons. Continue betting to see how your habits compare to responsible gambling benchmarks.
        </p>
      </div>
    );
  }

  // Calculate user metrics for comparison against benchmarks
  const calculateMetrics = () => {
    // Sort bets by timestamp
    const sortedBets = [...betHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Average risk level
    const avgRiskLevel = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length;
    
    // Maximum bet size as percentage of bankroll
    const maxBankrollPercentage = Math.max(...betHistory.map(bet => (bet.betAmount / bet.balanceAfter) * 100));
    
    // Session duration detection (a new session starts if there's a gap of more than 30 minutes)
    const sessionBreaks: number[] = [];
    for (let i = 1; i < sortedBets.length; i++) {
      const timeDiffMinutes = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60);
      if (timeDiffMinutes > 30) {
        sessionBreaks.push(i);
      }
    }
    
    // Calculate average session length
    const sessions = [0, ...sessionBreaks, sortedBets.length];
    let totalSessionDuration = 0;
    let sessionCount = 0;
    for (let i = 1; i < sessions.length; i++) {
      if (sessions[i] - sessions[i-1] > 1) {
        // If the session has at least 2 bets, calculate duration
        const sessionStart = new Date(sortedBets[sessions[i-1]].timestamp).getTime();
        const sessionEnd = new Date(sortedBets[sessions[i] - 1].timestamp).getTime();
        const durationMinutes = (sessionEnd - sessionStart) / (1000 * 60);
        totalSessionDuration += durationMinutes;
        sessionCount++;
      }
    }
    const avgSessionDuration = sessionCount > 0 ? totalSessionDuration / sessionCount : 0;
    
    // Break frequency (average number of bets before a significant time gap)
    const breakFrequency = sessionBreaks.length > 0 
      ? sortedBets.length / (sessionBreaks.length + 1) 
      : sortedBets.length;
    
    // Win rate
    const winRate = betHistory.filter(bet => bet.outcome === 'win').length / betHistory.length;
    
    // Game diversification (how evenly spread are bets across game types)
    const gameCounts: Record<string, number> = {};
    betHistory.forEach(bet => {
      gameCounts[bet.eventId] = (gameCounts[bet.eventId] || 0) + 1;
    });
    
    const gamePercentages = Object.values(gameCounts).map(count => count / betHistory.length);
    const giniCoefficient = calculateGiniCoefficient(gamePercentages);
    const diversificationIndex = 1 - giniCoefficient; // Higher means more diversified
    
    // Chase frequency (percentage of bets that chase losses)
    let chaseCount = 0;
    for (let i = 1; i < sortedBets.length; i++) {
      if (
        sortedBets[i-1].outcome === 'loss' && 
        sortedBets[i].betAmount > sortedBets[i-1].betAmount * 1.2
      ) {
        chaseCount++;
      }
    }
    const chaseFrequency = chaseCount / (sortedBets.length - 1);
    
    return {
      avgRiskLevel,
      maxBankrollPercentage,
      avgSessionDuration,
      breakFrequency,
      winRate,
      diversificationIndex,
      chaseFrequency
    };
  };

  // Calculate Gini coefficient to measure game diversification
  // (A standard economic measure of inequality, used here to measure how evenly spread bets are)
  const calculateGiniCoefficient = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const n = sortedValues.length;
    
    let sumNumerator = 0;
    for (let i = 0; i < n; i++) {
      sumNumerator += sortedValues[i] * (i + 1);
    }
    
    const sumDenominator = sortedValues.reduce((sum, val) => sum + val, 0);
    
    if (sumDenominator === 0) return 0;
    
    const coefficient = (2 * sumNumerator) / (n * sumDenominator) - (n + 1) / n;
    return coefficient;
  };

  // Calculate how user metrics compare to benchmarks
  const getComparisons = () => {
    const metrics = calculateMetrics();
    
    return {
      riskLevel: {
        user: metrics.avgRiskLevel,
        benchmark: responsibleBenchmarks.maxRiskLevel,
        score: Math.max(0, 100 - (metrics.avgRiskLevel / responsibleBenchmarks.maxRiskLevel) * 100),
        better: metrics.avgRiskLevel <= responsibleBenchmarks.maxRiskLevel
      },
      betSize: {
        user: metrics.maxBankrollPercentage,
        benchmark: responsibleBenchmarks.maxBankrollPercentage,
        score: Math.max(0, 100 - (metrics.maxBankrollPercentage / responsibleBenchmarks.maxBankrollPercentage) * 100),
        better: metrics.maxBankrollPercentage <= responsibleBenchmarks.maxBankrollPercentage
      },
      sessionDuration: {
        user: metrics.avgSessionDuration,
        benchmark: responsibleBenchmarks.maxSessionDuration,
        score: Math.max(0, 100 - (metrics.avgSessionDuration / responsibleBenchmarks.maxSessionDuration) * 100),
        better: metrics.avgSessionDuration <= responsibleBenchmarks.maxSessionDuration
      },
      breakFrequency: {
        user: metrics.breakFrequency,
        benchmark: responsibleBenchmarks.minBreakFrequency,
        score: Math.max(0, 100 - (metrics.breakFrequency / responsibleBenchmarks.minBreakFrequency) * 100),
        better: metrics.breakFrequency <= responsibleBenchmarks.minBreakFrequency
      },
      winRate: {
        user: metrics.winRate,
        benchmark: responsibleBenchmarks.winRateExpectation,
        score: 100, // Not scored since win rate is not directly controllable
        better: metrics.winRate >= responsibleBenchmarks.winRateExpectation
      },
      diversification: {
        user: metrics.diversificationIndex,
        benchmark: responsibleBenchmarks.riskDiversification,
        score: (metrics.diversificationIndex / responsibleBenchmarks.riskDiversification) * 100,
        better: metrics.diversificationIndex >= responsibleBenchmarks.riskDiversification
      },
      chaseLosses: {
        user: metrics.chaseFrequency,
        benchmark: responsibleBenchmarks.chaseFrequency,
        score: Math.max(0, 100 - (metrics.chaseFrequency / responsibleBenchmarks.chaseFrequency) * 100),
        better: metrics.chaseFrequency <= responsibleBenchmarks.chaseFrequency
      }
    };
  };

  const comparisons = getComparisons();
  
  // Calculate overall responsible gambling score
  const metrics = [
    comparisons.riskLevel,
    comparisons.betSize,
    comparisons.sessionDuration,
    comparisons.breakFrequency,
    comparisons.diversification,
    comparisons.chaseLosses
  ];
  
  const overallScore = Math.round(
    metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
  );
  
  // Function to get color classes based on comparison
  const getComparisonColors = (comparison: { better: boolean, score: number }) => {
    if (comparison.better) {
      return {
        text: isDarkMode ? 'text-green-400' : 'text-green-600',
        bg: isDarkMode ? 'bg-green-900/40' : 'bg-green-100',
        bar: isDarkMode ? 'bg-green-500' : 'bg-green-500'
      };
    } else {
      if (comparison.score >= 70) {
        return {
          text: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
          bg: isDarkMode ? 'bg-yellow-900/40' : 'bg-yellow-100',
          bar: isDarkMode ? 'bg-yellow-500' : 'bg-yellow-500'
        };
      } else {
        return {
          text: isDarkMode ? 'text-red-400' : 'text-red-600',
          bg: isDarkMode ? 'bg-red-900/40' : 'bg-red-100',
          bar: isDarkMode ? 'bg-red-500' : 'bg-red-500'
        };
      }
    }
  };

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="comparative-analytics">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Tooltip content="This section compares your betting habits with responsible gambling benchmarks to help you understand where your behavior might be risky.">
          Comparative Analytics
        </Tooltip>
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Tooltip content="This score indicates how well your gambling behavior aligns with responsible gambling practices on a scale from 0 to 100.">
                Responsible Gambling Score
              </Tooltip>
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Based on comparison with industry benchmarks</p>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${
              overallScore >= 80 
                ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                : overallScore >= 60 
                  ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              {overallScore}/100
            </span>
          </div>
        </div>
        <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
          <div 
            className={`h-full rounded-full ${
              overallScore >= 80 
                ? isDarkMode ? 'bg-green-500' : 'bg-green-500' 
                : overallScore >= 60 
                  ? isDarkMode ? 'bg-yellow-500' : 'bg-yellow-500'
                  : isDarkMode ? 'bg-red-500' : 'bg-red-500'
            }`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Betting Behavior Metrics</h3>
          
          {Object.entries(comparisons).map(([key, comparison]) => {
            const colors = getComparisonColors(comparison);
            let label, userValue, benchmarkValue, description;
            
            switch(key) {
              case 'riskLevel':
                label = 'Average Risk Level';
                userValue = `${Math.round(comparison.user)}%`;
                benchmarkValue = `${comparison.benchmark}% or less`;
                description = "Lower values indicate safer betting behavior";
                break;
              case 'betSize':
                label = 'Max Bet Size';
                userValue = `${Math.round(comparison.user)}% of bankroll`;
                benchmarkValue = `${comparison.benchmark}% or less`;
                description = "Smaller bets relative to your bankroll are safer";
                break;
              case 'sessionDuration':
                label = 'Session Duration';
                userValue = `${Math.round(comparison.user)} minutes`;
                benchmarkValue = `${comparison.benchmark} minutes or less`;
                description = "Shorter betting sessions help maintain control";
                break;
              case 'breakFrequency':
                label = 'Bets Between Breaks';
                userValue = `${Math.round(comparison.user)} bets`;
                benchmarkValue = `${comparison.benchmark} bets or fewer`;
                description = "Taking breaks helps maintain perspective";
                break;
              case 'winRate':
                label = 'Win Rate';
                userValue = `${(comparison.user * 100).toFixed(1)}%`;
                benchmarkValue = `${(comparison.benchmark * 100).toFixed(1)}%`;
                description = "Most games have a house edge, making perfect 50% unrealistic";
                break;
              case 'diversification':
                label = 'Game Diversification';
                userValue = `${(comparison.user * 100).toFixed(1)}%`;
                benchmarkValue = `${(comparison.benchmark * 100).toFixed(1)}% or more`;
                description = "Spreading bets across different games reduces risk";
                break;
              case 'chaseLosses':
                label = 'Loss Chasing';
                userValue = `${(comparison.user * 100).toFixed(1)}% of bets`;
                benchmarkValue = `${(comparison.benchmark * 100).toFixed(1)}% or less`;
                description = "Increasing bet size after losses can lead to larger losses";
                break;
              default:
                return null;
            }
            
            return (
              <div key={key} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Tooltip content={description}>
                      {label}
                    </Tooltip>
                  </p>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${colors.text}`}>{userValue}</span>
                    <span className={`text-xs mx-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>vs</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{benchmarkValue}</span>
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <div 
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${Math.min(100, comparison.score)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>How You Compare</h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Based on your betting patterns, here's how your behavior compares to responsible gambling guidelines:
          </p>
          
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {comparisons.riskLevel.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                Your average risk level is within recommended limits
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                Your risk level is {Math.round(comparisons.riskLevel.user - responsibleBenchmarks.maxRiskLevel)}% higher than recommended
              </li>
            )}
            
            {comparisons.betSize.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                Your bet sizes are within safe bankroll management guidelines
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                Your maximum bet size exceeds recommended bankroll percentages
              </li>
            )}
            
            {comparisons.sessionDuration.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                Your betting session durations are within healthy limits
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                Your betting sessions are longer than recommended
              </li>
            )}
            
            {comparisons.breakFrequency.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                You take breaks at appropriate intervals
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                You should take breaks more frequently while betting
              </li>
            )}
            
            {comparisons.diversification.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                Your bets are well-diversified across different games
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                Try diversifying your bets across more game types
              </li>
            )}
            
            {comparisons.chaseLosses.better ? (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</span>
                You rarely chase losses, which is a healthy behavior
              </li>
            ) : (
              <li className="flex items-start">
                <span className={`mr-2 mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>!</span>
                You chase losses more frequently than recommended
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recommendations</h3>
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {!comparisons.riskLevel.better && (
            <li>Reduce your average risk level by selecting more low and medium risk betting options</li>
          )}
          {!comparisons.betSize.better && (
            <li>Limit your bet sizes to no more than {responsibleBenchmarks.maxBankrollPercentage}% of your bankroll for better risk management</li>
          )}
          {!comparisons.sessionDuration.better && (
            <li>Keep your betting sessions under {responsibleBenchmarks.maxSessionDuration} minutes with clear start and end times</li>
          )}
          {!comparisons.breakFrequency.better && (
            <li>Take a break after every {responsibleBenchmarks.minBreakFrequency} bets to maintain perspective</li>
          )}
          {!comparisons.diversification.better && (
            <li>Try different types of betting games rather than focusing on just one or two</li>
          )}
          {!comparisons.chaseLosses.better && (
            <li>When you lose a bet, avoid increasing your bet size on the next wager</li>
          )}
          {Object.values(comparisons).every(comp => comp.better) && (
            <li>Your betting patterns align well with responsible gambling benchmarks. Continue these healthy practices!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ComparativeAnalytics; 