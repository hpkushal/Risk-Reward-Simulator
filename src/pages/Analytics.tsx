import React from 'react';
import { useGame } from '../context/GameContext';
import Layout from '../components/layout/Layout';
import BehavioralAnalysis from '../components/analytics/BehavioralAnalysis';
import FinancialMetrics from '../components/analytics/FinancialMetrics';
import BettingPatterns from '../components/analytics/BettingPatterns';
import PatternRecognition from '../components/analytics/PatternRecognition';
import GoalSetting from '../components/analytics/GoalSetting';
import { useTheme } from '../context/ThemeContext';

const Analytics: React.FC = () => {
  const { betHistory } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Layout>
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold mb-1">Betting Analytics</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Understand your betting habits and improve your strategy
          </p>
        </div>

        {betHistory.length === 0 ? (
          <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No Betting Data Yet</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Start placing bets to see your analytics. We need at least 3 bets to generate meaningful insights.
            </p>
            <a 
              href="/"
              className={`inline-block px-6 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              Go to Dashboard
            </a>
          </div>
        ) : (
          <>
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Analytics Overview</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                We've analyzed your {betHistory.length} bets to provide insights into your gambling habits and patterns.
                Use these insights to improve your strategy and develop more responsible gambling habits.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Bets</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{betHistory.length}</p>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Win Rate</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {((betHistory.filter(bet => bet.outcome === 'win').length / betHistory.length) * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Risk Level</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {(betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <BehavioralAnalysis />
            <FinancialMetrics />
            <BettingPatterns />
            <PatternRecognition />
            <GoalSetting />
            
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Responsible Gambling Tips</h2>
              <ul className={`list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Set a budget before you start betting and stick to it</li>
                <li>Take regular breaks during betting sessions</li>
                <li>Don't chase losses with bigger bets - this rarely works</li>
                <li>Keep betting as entertainment, not a way to make money</li>
                <li>Be mindful of how betting affects your mood and behavior</li>
                <li>Never bet more than you can afford to lose</li>
                <li>Track your betting history to identify unhealthy patterns</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
};

export default Analytics; 