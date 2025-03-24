import React from 'react';
import { useGame, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import Tooltip from '../ui/Tooltip';

interface PatternWarning {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

const PatternRecognition: React.FC = () => {
  const { betHistory } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Skip rendering if not enough data
  if (betHistory.length < 5) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="pattern-recognition">
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Tooltip content="Advanced algorithms identify potentially problematic patterns in your betting behavior and provide early warnings.">
            Pattern Recognition
          </Tooltip>
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We need at least 5 bets to detect meaningful patterns. Continue betting to see if any concerning patterns emerge.
        </p>
      </div>
    );
  }

  // Sort bets by timestamp for temporal analysis
  const sortedBets = [...betHistory].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Detect potentially problematic patterns
  const detectPatterns = (): PatternWarning[] => {
    const warnings: PatternWarning[] = [];
    
    // Pattern 1: Escalating bet sizes after losses (chasing losses)
    let chaseLossCount = 0;
    for (let i = 1; i < sortedBets.length; i++) {
      if (
        sortedBets[i-1].outcome === 'loss' && 
        sortedBets[i].betAmount > sortedBets[i-1].betAmount * 1.3
      ) {
        chaseLossCount++;
      }
    }
    
    const chaseLossRatio = chaseLossCount / (sortedBets.length - 1);
    if (chaseLossRatio > 0.2) {
      warnings.push({
        id: 'chase-losses',
        title: 'Chasing Losses',
        description: `You increased your bet size after a loss ${Math.round(chaseLossRatio * 100)}% of the time. This pattern often leads to larger losses.`,
        severity: chaseLossRatio > 0.4 ? 'high' : chaseLossRatio > 0.3 ? 'medium' : 'low',
        recommendation: 'Try to maintain consistent bet sizes regardless of previous outcomes. Consider taking a break after losses before placing your next bet.'
      });
    }
    
    // Pattern 2: Consistently high risk bets (risk-seeking)
    const avgRiskLevel = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length;
    const highRiskBets = betHistory.filter(bet => bet.riskPercentage > 60);
    const highRiskRatio = highRiskBets.length / betHistory.length;
    
    if (avgRiskLevel > 50 || highRiskRatio > 0.4) {
      warnings.push({
        id: 'high-risk',
        title: 'High-Risk Betting',
        description: `${Math.round(highRiskRatio * 100)}% of your bets are high-risk (above 60% risk level). Your average risk level is ${Math.round(avgRiskLevel)}%.`,
        severity: avgRiskLevel > 70 ? 'high' : avgRiskLevel > 60 ? 'medium' : 'low',
        recommendation: 'Balance your portfolio with more low and medium risk bets to protect your bankroll from significant losses.'
      });
    }
    
    // Pattern 3: Betting too frequently (compulsive betting)
    const timeGaps: number[] = [];
    for (let i = 1; i < sortedBets.length; i++) {
      const timeDiffMinutes = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60);
      timeGaps.push(timeDiffMinutes);
    }
    
    const rapidBetCount = timeGaps.filter(gap => gap < 2).length;
    const rapidBetRatio = rapidBetCount / timeGaps.length;
    
    if (rapidBetRatio > 0.3) {
      warnings.push({
        id: 'rapid-betting',
        title: 'Rapid Betting',
        description: `${Math.round(rapidBetRatio * 100)}% of your bets are placed within 2 minutes of the previous bet. This may indicate impulsive betting.`,
        severity: rapidBetRatio > 0.6 ? 'high' : rapidBetRatio > 0.45 ? 'medium' : 'low',
        recommendation: 'Take more time between bets to make thoughtful decisions. Consider setting a 5-minute cooling-off period between bets.'
      });
    }
    
    // Pattern 4: Martingale-like progression (doubling after losses)
    let martingaleCount = 0;
    for (let i = 1; i < sortedBets.length; i++) {
      if (
        sortedBets[i-1].outcome === 'loss' && 
        Math.abs(sortedBets[i].betAmount / sortedBets[i-1].betAmount - 2) < 0.3
      ) {
        martingaleCount++;
      }
    }
    
    const martingaleRatio = martingaleCount / (sortedBets.length - 1);
    if (martingaleRatio > 0.15) {
      warnings.push({
        id: 'martingale',
        title: 'Martingale Strategy',
        description: `You appear to be using a Martingale-like strategy (doubling after losses) ${Math.round(martingaleRatio * 100)}% of the time. This is high-risk over the long term.`,
        severity: martingaleRatio > 0.3 ? 'high' : martingaleRatio > 0.2 ? 'medium' : 'low',
        recommendation: 'Avoid doubling your bet after losses. This strategy can quickly deplete your bankroll with a series of consecutive losses.'
      });
    }
    
    // Pattern 5: All-in behavior (betting large percentages of bankroll)
    const bankrollPercentages = betHistory.map(bet => (bet.betAmount / bet.balanceAfter) * 100);
    const largeStakeCount = bankrollPercentages.filter(pct => pct > 20).length;
    const largeStakeRatio = largeStakeCount / betHistory.length;
    
    if (largeStakeRatio > 0.15) {
      warnings.push({
        id: 'large-stakes',
        title: 'Large Stakes',
        description: `${Math.round(largeStakeRatio * 100)}% of your bets exceed 20% of your bankroll. Large stakes increase your risk of significant losses.`,
        severity: largeStakeRatio > 0.3 ? 'high' : largeStakeRatio > 0.2 ? 'medium' : 'low',
        recommendation: 'Limit your bet sizes to 5-10% of your bankroll to ensure longevity and reduce the impact of losing streaks.'
      });
    }
    
    // Pattern 6: Tilting after wins (overconfidence)
    let postWinRiskIncrease = 0;
    for (let i = 1; i < sortedBets.length; i++) {
      if (
        sortedBets[i-1].outcome === 'win' && 
        sortedBets[i].riskPercentage > sortedBets[i-1].riskPercentage * 1.3
      ) {
        postWinRiskIncrease++;
      }
    }
    
    const winCount = sortedBets.filter(bet => bet.outcome === 'win').length;
    const postWinRiskRatio = winCount > 0 ? postWinRiskIncrease / winCount : 0;
    
    if (postWinRiskRatio > 0.3) {
      warnings.push({
        id: 'overconfidence',
        title: 'Post-Win Overconfidence',
        description: `You tend to take significantly higher risks after winning (${Math.round(postWinRiskRatio * 100)}% of the time). This can lead to giving back wins.`,
        severity: postWinRiskRatio > 0.5 ? 'high' : postWinRiskRatio > 0.4 ? 'medium' : 'low',
        recommendation: 'Maintain consistent risk levels regardless of previous outcomes. Consider taking some profits off the table after significant wins.'
      });
    }
    
    // Pattern 7: Loss streaks without breaks
    const detectLossStreaks = () => {
      let maxLossStreak = 0;
      let currentLossStreak = 0;
      
      for (const bet of sortedBets) {
        if (bet.outcome === 'loss') {
          currentLossStreak++;
          maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
        } else {
          currentLossStreak = 0;
        }
      }
      
      return maxLossStreak;
    };
    
    const maxLossStreak = detectLossStreaks();
    if (maxLossStreak >= 4) {
      warnings.push({
        id: 'loss-streak',
        title: 'Extended Loss Streak',
        description: `You experienced a streak of ${maxLossStreak} consecutive losses without taking a break. This can lead to emotional decision-making.`,
        severity: maxLossStreak >= 6 ? 'high' : maxLossStreak >= 5 ? 'medium' : 'low',
        recommendation: 'Take a break after 3 consecutive losses to reset your mindset and prevent emotional decisions.'
      });
    }
    
    return warnings;
  };

  const patternWarnings = detectPatterns();
  const highSeverityWarnings = patternWarnings.filter(w => w.severity === 'high');
  const mediumSeverityWarnings = patternWarnings.filter(w => w.severity === 'medium');
  const lowSeverityWarnings = patternWarnings.filter(w => w.severity === 'low');

  // Function to get color classes based on severity
  const getSeverityColors = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return {
          bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-50',
          border: isDarkMode ? 'border-red-800' : 'border-red-200',
          text: isDarkMode ? 'text-red-400' : 'text-red-700',
          icon: isDarkMode ? 'text-red-500' : 'text-red-500'
        };
      case 'medium':
        return {
          bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
          border: isDarkMode ? 'border-yellow-800' : 'border-yellow-200',
          text: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
          icon: isDarkMode ? 'text-yellow-500' : 'text-yellow-500'
        };
      case 'low':
        return {
          bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
          border: isDarkMode ? 'border-blue-800' : 'border-blue-200',
          text: isDarkMode ? 'text-blue-400' : 'text-blue-700',
          icon: isDarkMode ? 'text-blue-500' : 'text-blue-500'
        };
    }
  };

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="pattern-recognition">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Tooltip content="Advanced algorithms identify potentially problematic patterns in your betting behavior and provide early warnings.">
          Pattern Recognition
        </Tooltip>
      </h2>
      
      {patternWarnings.length === 0 ? (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start">
            <div className={`mr-3 mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>No Problematic Patterns Detected</h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Your betting behavior appears to follow responsible gambling practices. Continue these healthy habits!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <Tooltip content="We've identified patterns in your betting behavior that may indicate potential risks. These are categorized by severity level.">
                  Detected Patterns
                </Tooltip>
              </h3>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {highSeverityWarnings.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full mr-2 ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                    {highSeverityWarnings.length} High
                  </span>
                )}
                {mediumSeverityWarnings.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full mr-2 ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                    {mediumSeverityWarnings.length} Medium
                  </span>
                )}
                {lowSeverityWarnings.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    {lowSeverityWarnings.length} Low
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* High severity warnings first */}
            {highSeverityWarnings.map(warning => {
              const colors = getSeverityColors(warning.severity);
              return (
                <div key={warning.id} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                  <div className="flex items-start">
                    <div className={`mr-3 mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} ${colors.icon}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${colors.text}`}>{warning.title}</h4>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{warning.description}</p>
                      <p className={`text-sm mt-2 font-medium ${colors.text}`}>Recommendation: {warning.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Medium severity warnings */}
            {mediumSeverityWarnings.map(warning => {
              const colors = getSeverityColors(warning.severity);
              return (
                <div key={warning.id} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                  <div className="flex items-start">
                    <div className={`mr-3 mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} ${colors.icon}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${colors.text}`}>{warning.title}</h4>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{warning.description}</p>
                      <p className={`text-sm mt-2 font-medium ${colors.text}`}>Recommendation: {warning.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Low severity warnings */}
            {lowSeverityWarnings.map(warning => {
              const colors = getSeverityColors(warning.severity);
              return (
                <div key={warning.id} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                  <div className="flex items-start">
                    <div className={`mr-3 mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} ${colors.icon}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${colors.text}`}>{warning.title}</h4>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{warning.description}</p>
                      <p className={`text-sm mt-2 font-medium ${colors.text}`}>Recommendation: {warning.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <div className="mt-6">
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>About Pattern Recognition</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Our algorithm analyzes your betting history to detect potentially problematic patterns. These patterns are common precursors to gambling problems and are categorized by severity:
        </p>
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <li><span className={isDarkMode ? 'text-red-400' : 'text-red-700'}>High severity</span>: Patterns that may lead to significant negative consequences if continued</li>
          <li><span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}>Medium severity</span>: Patterns that indicate potential issues and should be monitored</li>
          <li><span className={isDarkMode ? 'text-blue-400' : 'text-blue-700'}>Low severity</span>: Mild patterns that are worth being aware of</li>
        </ul>
      </div>
    </div>
  );
};

export default PatternRecognition; 