import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import Tooltip from '../ui/Tooltip';

// Define the Goal interface
interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'minutes' | 'count';
  defaultValue: number;
  currentValue: number;
  isCompleted: boolean;
  isActive: boolean;
}

// Default goals
const defaultGoals: Goal[] = [
  {
    id: 'max-bet',
    title: 'Maximum Bet Size',
    description: 'Set a maximum percentage of your bankroll for any single bet',
    type: 'percentage',
    defaultValue: 10,
    currentValue: 10,
    isCompleted: false,
    isActive: true
  },
  {
    id: 'session-limit',
    title: 'Session Time Limit',
    description: 'Set a maximum duration for your betting sessions',
    type: 'minutes',
    defaultValue: 60,
    currentValue: 60,
    isCompleted: false,
    isActive: true
  },
  {
    id: 'bet-frequency',
    title: 'Daily Bet Limit',
    description: 'Set a maximum number of bets you want to place per day',
    type: 'count',
    defaultValue: 20,
    currentValue: 20,
    isCompleted: false,
    isActive: true
  },
  {
    id: 'risk-level',
    title: 'Average Risk Level',
    description: 'Keep your average risk level below this percentage',
    type: 'percentage',
    defaultValue: 40,
    currentValue: 40,
    isCompleted: false,
    isActive: true
  },
  {
    id: 'break-frequency',
    title: 'Break Frequency',
    description: 'Take a break after this many consecutive bets',
    type: 'count',
    defaultValue: 5,
    currentValue: 5,
    isCompleted: false,
    isActive: true
  },
  {
    id: 'profit-target',
    title: 'Profit Target',
    description: 'Stop when you reach this profit percentage in a session',
    type: 'percentage',
    defaultValue: 50,
    currentValue: 50,
    isCompleted: false,
    isActive: false
  },
  {
    id: 'loss-limit',
    title: 'Loss Limit',
    description: 'Stop when you lose this percentage of your bankroll',
    type: 'percentage',
    defaultValue: 20,
    currentValue: 20,
    isCompleted: false,
    isActive: false
  }
];

const GoalSetting: React.FC = () => {
  // Get theme and game context
  const { theme } = useTheme();
  const { betHistory } = useGame();
  const isDarkMode = theme === 'dark';
  
  // Initialize state
  const [goals, setGoals] = useState<Goal[]>(() => {
    // Try to load goals from localStorage
    const savedGoals = localStorage.getItem('bettingGoals');
    return savedGoals ? JSON.parse(savedGoals) : defaultGoals;
  });
  
  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bettingGoals', JSON.stringify(goals));
  }, [goals]);
  
  // Handle goal value change
  const handleGoalValueChange = (id: string, value: number): void => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id ? { ...goal, currentValue: value } : goal
      )
    );
  };
  
  // Toggle goal active status
  const toggleGoalActive = (id: string): void => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id ? { ...goal, isActive: !goal.isActive } : goal
      )
    );
  };
  
  // Calculate progress towards goals
  const calculateGoalProgress = (): void => {
    // If not enough betting history, we can't calculate progress
    if (betHistory.length < 3) return;
    
    // Calculate metrics to check against goals
    const sortedBets = [...betHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Maximum bet as percentage of bankroll
    const maxBetPercentage = Math.max(...betHistory.map(bet => (bet.betAmount / bet.balanceAfter) * 100));
    
    // Average risk level
    const avgRiskLevel = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length;
    
    // Session duration (a new session starts if there's a gap of more than 30 minutes)
    const sessions: number[][] = [];
    let currentSession = [0];
    
    for (let i = 1; i < sortedBets.length; i++) {
      const timeDiffMinutes = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60);
      if (timeDiffMinutes > 30) {
        sessions.push(currentSession);
        currentSession = [i];
      } else {
        currentSession.push(i);
      }
    }
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    // Get longest session duration
    let maxSessionDuration = 0;
    sessions.forEach(session => {
      if (session.length < 2) return; // Skip sessions with only one bet
      
      const sessionStart = new Date(sortedBets[session[0]].timestamp).getTime();
      const sessionEnd = new Date(sortedBets[session[session.length - 1]].timestamp).getTime();
      const durationMinutes = (sessionEnd - sessionStart) / (1000 * 60);
      
      maxSessionDuration = Math.max(maxSessionDuration, durationMinutes);
    });
    
    // Get maximum bets per day
    const betsByDay: Record<string, number> = {};
    betHistory.forEach(bet => {
      const dateKey = new Date(bet.timestamp).toISOString().split('T')[0];
      betsByDay[dateKey] = (betsByDay[dateKey] || 0) + 1;
    });
    
    const maxBetsPerDay = Math.max(...Object.values(betsByDay));
    
    // Get maximum consecutive bets without a break
    let maxConsecutiveBets = 0;
    let currentConsecutiveBets = 1;
    
    for (let i = 1; i < sortedBets.length; i++) {
      const timeDiffMinutes = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60);
      if (timeDiffMinutes < 10) { // Less than 10 minutes counts as consecutive
        currentConsecutiveBets++;
      } else {
        maxConsecutiveBets = Math.max(maxConsecutiveBets, currentConsecutiveBets);
        currentConsecutiveBets = 1;
      }
    }
    
    maxConsecutiveBets = Math.max(maxConsecutiveBets, currentConsecutiveBets);
    
    // Calculate profit and loss
    const initialBalance = sortedBets[0].balanceAfter - (sortedBets[0].outcome === 'win' ? sortedBets[0].winAmount : -sortedBets[0].betAmount);
    const currentBalance = sortedBets[sortedBets.length - 1].balanceAfter;
    const profitPercentage = ((currentBalance - initialBalance) / initialBalance) * 100;
    const maxLossPercentage = initialBalance > 0 ? ((initialBalance - Math.min(...sortedBets.map(b => b.balanceAfter))) / initialBalance) * 100 : 0;
    
    // Update goals' completion status
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        let isCompleted = false;
        
        switch(goal.id) {
          case 'max-bet':
            isCompleted = maxBetPercentage <= goal.currentValue;
            break;
          case 'session-limit':
            isCompleted = maxSessionDuration <= goal.currentValue;
            break;
          case 'bet-frequency':
            isCompleted = maxBetsPerDay <= goal.currentValue;
            break;
          case 'risk-level':
            isCompleted = avgRiskLevel <= goal.currentValue;
            break;
          case 'break-frequency':
            isCompleted = maxConsecutiveBets <= goal.currentValue;
            break;
          case 'profit-target':
            isCompleted = profitPercentage >= goal.currentValue;
            break;
          case 'loss-limit':
            isCompleted = maxLossPercentage <= goal.currentValue;
            break;
          default:
            break;
        }
        
        return { ...goal, isCompleted };
      })
    );
  };
  
  // Calculate goal progress whenever betting history changes
  useEffect(() => {
    calculateGoalProgress();
  }, [betHistory]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Calculate the percentage of active goals that are completed
  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = activeGoals.filter(goal => goal.isCompleted);
  const goalProgressPercentage = activeGoals.length > 0 
    ? Math.round((completedGoals.length / activeGoals.length) * 100) 
    : 0;
    
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`} id="goal-setting">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Tooltip content="Set personal goals for responsible gambling and track your progress towards meeting them. These goals help you maintain control over your betting habits.">
          Goal Setting
        </Tooltip>
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Tooltip content="This shows your progress towards meeting your active responsible gambling goals.">
                Goal Progress
              </Tooltip>
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {betHistory.length < 3 
                ? "Place at least 3 bets to see your progress"
                : `${completedGoals.length} of ${activeGoals.length} goals met`}
            </p>
          </div>
          {betHistory.length >= 3 && (
            <div className="text-right">
              <span className={`text-3xl font-bold ${
                goalProgressPercentage >= 80 
                  ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                  : goalProgressPercentage >= 50 
                    ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                    : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {goalProgressPercentage}%
              </span>
            </div>
          )}
        </div>
        {betHistory.length >= 3 && (
          <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
            <div 
              className={`h-full rounded-full ${
                goalProgressPercentage >= 80 
                  ? isDarkMode ? 'bg-green-500' : 'bg-green-500' 
                  : goalProgressPercentage >= 50 
                    ? isDarkMode ? 'bg-yellow-500' : 'bg-yellow-500'
                    : isDarkMode ? 'bg-red-500' : 'bg-red-500'
              }`}
              style={{ width: `${goalProgressPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {goals.map(goal => (
          <div 
            key={goal.id} 
            className={`p-4 rounded-lg border ${
              goal.isActive
                ? goal.isCompleted
                  ? isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                  : isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                : isDarkMode ? 'bg-gray-800 border-gray-700 opacity-50' : 'bg-gray-100 border-gray-200 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={goal.isActive}
                  onChange={() => toggleGoalActive(goal.id)}
                  className={`mt-1 mr-3 h-4 w-4 rounded ${
                    isDarkMode ? 'bg-gray-700 border-gray-500 checked:bg-blue-600' : 'bg-gray-100 border-gray-300 checked:bg-blue-500'
                  }`}
                />
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    <Tooltip content={goal.description}>
                      {goal.title}
                    </Tooltip>
                  </h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {goal.description}
                  </p>
                </div>
              </div>
              {goal.isActive && goal.isCompleted && (
                <span className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Met
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={goal.type === 'percentage' ? 5 : 1}
                max={goal.type === 'percentage' ? 100 : goal.type === 'minutes' ? 120 : 50}
                step={goal.type === 'percentage' ? 5 : 1}
                value={goal.currentValue}
                onChange={(e) => handleGoalValueChange(goal.id, parseInt(e.target.value))}
                disabled={!goal.isActive}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                  goal.isActive
                    ? isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
              <span className={`font-medium min-w-[60px] text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {goal.currentValue}{goal.type === 'percentage' ? '%' : goal.type === 'minutes' ? ' min' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tips for Setting Goals</h3>
        <ul className={`list-disc list-inside text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>Start with achievable goals and gradually make them more challenging</li>
          <li>Focus on the goals that address your specific betting vulnerabilities</li>
          <li>Review and adjust your goals regularly based on your betting patterns</li>
          <li>Setting time and money limits is the foundation of responsible gambling</li>
          <li>Remember that goals are meant to help you enjoy gambling safely, not restrict your enjoyment</li>
        </ul>
      </div>
    </div>
  );
};

export default GoalSetting; 