import React from 'react';
import { useGame, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const BehavioralAnalysis: React.FC = () => {
  const { betHistory } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Skip rendering if not enough data
  if (betHistory.length < 3) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Behavioral Analysis</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Place at least 3 bets to see your betting behavior analysis.
        </p>
      </div>
    );
  }

  // Calculate time between bets to analyze betting frequency
  const bettingIntervals: number[] = [];
  const sortedBets = [...betHistory].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  for (let i = 1; i < sortedBets.length; i++) {
    const timeGap = new Date(sortedBets[i].timestamp).getTime() - 
                    new Date(sortedBets[i-1].timestamp).getTime();
    bettingIntervals.push(timeGap);
  }
  
  const avgBettingInterval = bettingIntervals.length > 0 ? 
    Math.floor(bettingIntervals.reduce((sum, interval) => sum + interval, 0) / bettingIntervals.length / 1000) : 0;
  
  // Analyze reaction to losses
  const lossReactions: { accelerated: number, cautious: number, unchanged: number } = { 
    accelerated: 0, 
    cautious: 0, 
    unchanged: 0 
  };
  
  for (let i = 1; i < betHistory.length; i++) {
    if (betHistory[i-1].outcome === 'loss') {
      const prevBet = betHistory[i-1].betAmount;
      const currentBet = betHistory[i].betAmount;
      
      if (currentBet > prevBet * 1.2) {
        lossReactions.accelerated++;
      } else if (currentBet < prevBet * 0.8) {
        lossReactions.cautious++;
      } else {
        lossReactions.unchanged++;
      }
    }
  }
  
  // Calculate risk appetite consistency
  const riskValues = betHistory.map(bet => bet.riskPercentage);
  const avgRisk = riskValues.reduce((sum, risk) => sum + risk, 0) / riskValues.length;
  const riskDeviation = Math.sqrt(
    riskValues.reduce((sum, risk) => sum + Math.pow(risk - avgRisk, 2), 0) / riskValues.length
  );
  
  const getRiskAppetiteDescription = (deviation: number): string => {
    if (deviation < 10) return "Very Consistent";
    if (deviation < 20) return "Somewhat Consistent";
    if (deviation < 30) return "Variable";
    return "Highly Variable";
  };
  
  // Calculate decision making under emotion (wins/losses)
  const postWinBets = betHistory.filter((bet, index) => 
    index > 0 && betHistory[index-1].outcome === 'win'
  );
  
  const postLossBets = betHistory.filter((bet, index) => 
    index > 0 && betHistory[index-1].outcome === 'loss'
  );
  
  const avgPostWinRisk = postWinBets.length > 0 ?
    postWinBets.reduce((sum, bet) => sum + bet.riskPercentage, 0) / postWinBets.length : 0;
    
  const avgPostLossRisk = postLossBets.length > 0 ?
    postLossBets.reduce((sum, bet) => sum + bet.riskPercentage, 0) / postLossBets.length : 0;
  
  // Determine behavioral traits based on analysis
  const behavioralTraits: string[] = [];
  
  // Frequency trait
  if (avgBettingInterval < 30) {
    behavioralTraits.push("Rapid Bettor");
  } else if (avgBettingInterval > 120) {
    behavioralTraits.push("Methodical Bettor");
  }
  
  // Loss reaction trait
  if (lossReactions.accelerated > lossReactions.cautious && lossReactions.accelerated > lossReactions.unchanged) {
    behavioralTraits.push("Loss Chaser");
  } else if (lossReactions.cautious > lossReactions.accelerated && lossReactions.cautious > lossReactions.unchanged) {
    behavioralTraits.push("Loss Avoider");
  }
  
  // Risk consistency trait
  if (riskDeviation < 15) {
    behavioralTraits.push("Risk Consistent");
  } else if (riskDeviation > 25) {
    behavioralTraits.push("Risk Explorer");
  }
  
  // Emotional betting trait
  if (avgPostWinRisk > avgRisk + 10) {
    behavioralTraits.push("Confidence After Wins");
  } else if (avgPostLossRisk > avgRisk + 10) {
    behavioralTraits.push("Aggressive After Losses");
  } else if (avgPostLossRisk < avgRisk - 10) {
    behavioralTraits.push("Conservative After Losses");
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Behavioral Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Betting Frequency</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Average time between bets: <span className="font-medium">{avgBettingInterval} seconds</span>
          </p>
          {avgBettingInterval < 30 && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              You place bets rapidly. Consider taking more time between decisions.
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Risk Appetite</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Average risk level: <span className="font-medium">{avgRisk.toFixed(1)}%</span><br />
            Consistency: <span className="font-medium">{getRiskAppetiteDescription(riskDeviation)}</span>
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reaction to Losses</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lossReactions.accelerated}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Increased Bets</p>
            </div>
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lossReactions.unchanged}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Same Level</p>
            </div>
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lossReactions.cautious}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Decreased Bets</p>
            </div>
          </div>
          {lossReactions.accelerated > lossReactions.cautious && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              You tend to increase bets after losses, which can lead to chasing losses.
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Emotional Betting</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Average risk after wins: <span className="font-medium">{avgPostWinRisk.toFixed(1)}%</span>
              </p>
            </div>
            <div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Average risk after losses: <span className="font-medium">{avgPostLossRisk.toFixed(1)}%</span>
              </p>
            </div>
          </div>
          {Math.abs(avgPostWinRisk - avgPostLossRisk) > 15 && (
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Your betting behavior changes significantly based on previous outcomes.
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Betting Personality</h3>
        <div className="flex flex-wrap gap-2">
          {behavioralTraits.map((trait, index) => (
            <span 
              key={index} 
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tips for Improvement</h3>
        <ul className={`text-sm list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {avgBettingInterval < 30 && (
            <li>Take more time between bets to make thoughtful decisions</li>
          )}
          {lossReactions.accelerated > lossReactions.cautious && (
            <li>Avoid increasing bet sizes after losses to prevent chasing losses</li>
          )}
          {riskDeviation > 25 && (
            <li>Consider maintaining a more consistent risk level across your betting sessions</li>
          )}
          {Math.abs(avgPostWinRisk - avgPostLossRisk) > 15 && (
            <li>Try to maintain consistent betting patterns regardless of previous outcomes</li>
          )}
          {behavioralTraits.length === 0 && (
            <li>Continue playing to develop a clearer betting personality profile</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BehavioralAnalysis; 