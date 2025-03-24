import React from 'react';
import { useGame, BetEvent, BetHistory } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const BettingPatterns: React.FC = () => {
  const { betHistory, betEvents } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Skip rendering if not enough data
  if (betHistory.length < 3) {
    return (
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Betting Patterns</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Place at least 3 bets to see your betting pattern analysis.
        </p>
      </div>
    );
  }
  
  // Find most commonly bet event
  const eventFrequency = betHistory.reduce((acc: Record<string, number>, bet) => {
    acc[bet.eventId] = (acc[bet.eventId] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommonEventId = Object.entries(eventFrequency)
    .sort((a, b) => b[1] - a[1])[0][0];
    
  const mostCommonEvent = betEvents.find(e => e.id === mostCommonEventId);
  
  // Calculate success rate by event
  const eventSuccessRates: Record<string, { total: number, wins: number, successRate: number }> = {};
  
  betHistory.forEach(bet => {
    if (!eventSuccessRates[bet.eventId]) {
      eventSuccessRates[bet.eventId] = { total: 0, wins: 0, successRate: 0 };
    }
    
    eventSuccessRates[bet.eventId].total += 1;
    if (bet.outcome === 'win') {
      eventSuccessRates[bet.eventId].wins += 1;
    }
  });
  
  // Calculate success rates as percentages
  Object.keys(eventSuccessRates).forEach(eventId => {
    const { total, wins } = eventSuccessRates[eventId];
    eventSuccessRates[eventId].successRate = (wins / total) * 100;
  });
  
  // Find most and least successful events
  const successRateEntries = Object.entries(eventSuccessRates)
    .filter(([, data]) => data.total >= 2) // Need at least 2 bets for meaningful analysis
    .sort((a, b) => b[1].successRate - a[1].successRate);
    
  const mostSuccessfulEventId = successRateEntries.length > 0 ? successRateEntries[0][0] : null;
  const leastSuccessfulEventId = successRateEntries.length > 0 ? 
    successRateEntries[successRateEntries.length - 1][0] : null;
  
  const mostSuccessfulEvent = mostSuccessfulEventId ? 
    betEvents.find(e => e.id === mostSuccessfulEventId) : null;
    
  const leastSuccessfulEvent = leastSuccessfulEventId ? 
    betEvents.find(e => e.id === leastSuccessfulEventId) : null;
  
  // Analyze time of day patterns
  const timeDistribution = betHistory.reduce((acc: Record<string, number>, bet) => {
    const hour = new Date(bet.timestamp).getHours();
    const timePeriod = 
      hour < 6 ? 'night' :
      hour < 12 ? 'morning' :
      hour < 18 ? 'afternoon' : 
      'evening';
    
    acc[timePeriod] = (acc[timePeriod] || 0) + 1;
    return acc;
  }, {});
  
  const timeSuccess = betHistory.reduce((acc: Record<string, { wins: number, total: number }>, bet) => {
    const hour = new Date(bet.timestamp).getHours();
    const timePeriod = 
      hour < 6 ? 'night' :
      hour < 12 ? 'morning' :
      hour < 18 ? 'afternoon' : 
      'evening';
    
    if (!acc[timePeriod]) {
      acc[timePeriod] = { wins: 0, total: 0 };
    }
    
    acc[timePeriod].total += 1;
    if (bet.outcome === 'win') {
      acc[timePeriod].wins += 1;
    }
    
    return acc;
  }, {});
  
  // Calculate win rates for each time period
  const timeSuccessRates: Record<string, number> = {};
  Object.keys(timeSuccess).forEach(time => {
    const { wins, total } = timeSuccess[time];
    timeSuccessRates[time] = (wins / total) * 100;
  });
  
  // Find best time for betting
  let bestTimePeriod = '';
  let bestTimeSuccessRate = 0;
  
  Object.entries(timeSuccessRates).forEach(([time, rate]) => {
    if (timeSuccess[time].total >= 2 && rate > bestTimeSuccessRate) {
      bestTimePeriod = time;
      bestTimeSuccessRate = rate;
    }
  });
  
  // Analyze chase-loss behavior
  const analyzeChaseLoss = (betHistory: BetHistory[]): { chaseCount: number, chaseSuccessCount: number } => {
    const sortedBets = [...betHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    let chaseCount = 0;
    let chaseSuccessCount = 0;
    
    for (let i = 1; i < sortedBets.length; i++) {
      if (
        sortedBets[i-1].outcome === 'loss' && 
        sortedBets[i].betAmount > sortedBets[i-1].betAmount * 1.2
      ) {
        chaseCount++;
        if (sortedBets[i].outcome === 'win') {
          chaseSuccessCount++;
        }
      }
    }
    
    return { chaseCount, chaseSuccessCount };
  };
  
  const chaseLossStats = analyzeChaseLoss(betHistory);
  const chaseLossSuccessRate = chaseLossStats.chaseCount > 0 ? 
    (chaseLossStats.chaseSuccessCount / chaseLossStats.chaseCount) * 100 : 0;
  
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Betting Patterns</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Game Preferences</h3>
          {mostCommonEvent && (
            <div className="mb-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Most Played Game</p>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{mostCommonEvent.icon}</span>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{mostCommonEvent.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Played {eventFrequency[mostCommonEventId]} times ({Math.round((eventFrequency[mostCommonEventId] / betHistory.length) * 100)}% of all bets)
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Game Risk Preference</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Low', 'Medium', 'High'].map((risk) => {
                  const riskCount = betHistory.filter(bet => {
                    const event = betEvents.find(e => e.id === bet.eventId);
                    return event?.riskLevel === risk;
                  }).length;
                  
                  const percentage = (riskCount / betHistory.length) * 100;
                  
                  return (
                    <div 
                      key={risk}
                      className={`px-2 py-1 rounded-full text-xs ${
                        risk === 'Low' 
                          ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                          : risk === 'Medium'
                            ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                            : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {risk}: {Math.round(percentage)}%
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Success Patterns</h3>
          {mostSuccessfulEvent && mostSuccessfulEventId && (
            <div className="mb-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Most Successful Game</p>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{mostSuccessfulEvent.icon}</span>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{mostSuccessfulEvent.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Win rate: {eventSuccessRates[mostSuccessfulEventId].successRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {leastSuccessfulEvent && leastSuccessfulEventId && (
            <div className="mb-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Least Successful Game</p>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{leastSuccessfulEvent.icon}</span>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{leastSuccessfulEvent.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Win rate: {eventSuccessRates[leastSuccessfulEventId].successRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Time Patterns</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>When You Bet Most</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(timeDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([time, count], index) => (
                    <div 
                      key={time}
                      className={`px-2 py-1 rounded-full text-xs ${
                        index === 0
                          ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}: {Math.round((count / betHistory.length) * 100)}%
                    </div>
                  ))
                }
              </div>
            </div>
            
            {bestTimePeriod && (
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best Time to Bet</p>
                <p className={`font-medium mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {bestTimePeriod.charAt(0).toUpperCase() + bestTimePeriod.slice(1)}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Win rate: {bestTimeSuccessRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loss Recovery Patterns</h3>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chasing Losses</p>
            <p className={`font-medium text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {chaseLossStats.chaseCount} attempts
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Success rate:</p>
              <span className={`px-2 py-1 rounded-full text-xs ${
                chaseLossSuccessRate > 50
                  ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                  : chaseLossSuccessRate > 25
                    ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                    : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
              }`}>
                {chaseLossSuccessRate.toFixed(1)}%
              </span>
            </div>
            {chaseLossStats.chaseCount > 2 && chaseLossSuccessRate < 40 && (
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Chasing losses hasn't been an effective strategy for you. Consider taking a break after losses.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tips Based on Your Patterns</h3>
        <ul className={`text-sm list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {mostSuccessfulEvent && mostSuccessfulEventId && (
            <li>You have a high success rate with {mostSuccessfulEvent.name}. Consider focusing more on this game.</li>
          )}
          
          {leastSuccessfulEvent && leastSuccessfulEventId && eventSuccessRates[leastSuccessfulEventId].total >= 3 && eventSuccessRates[leastSuccessfulEventId].successRate < 20 && (
            <li>Your success rate with {leastSuccessfulEvent.name} is low. Consider avoiding this game or revising your strategy.</li>
          )}
          
          {bestTimePeriod && bestTimeSuccessRate > 60 && (
            <li>Your win rate is higher during the {bestTimePeriod}. Consider betting more during this time if possible.</li>
          )}
          
          {chaseLossStats.chaseCount > 2 && chaseLossSuccessRate < 40 && (
            <li>Your attempts to chase losses have been largely unsuccessful. Avoid increasing bet sizes after losses.</li>
          )}
          
          {Object.values(eventSuccessRates).length > 0 && Object.values(eventSuccessRates).every(rate => rate.successRate < 30) && (
            <li>Your overall success rates are low across all games. Consider more conservative betting strategies.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BettingPatterns; 