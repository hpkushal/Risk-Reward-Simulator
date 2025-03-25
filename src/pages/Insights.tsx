import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';
import BehavioralAnalysis from '../components/analytics/BehavioralAnalysis';
import FinancialMetrics from '../components/analytics/FinancialMetrics';
import BettingPatterns from '../components/analytics/BettingPatterns';
import PatternRecognition from '../components/analytics/PatternRecognition';
import ComparativeAnalytics from '../components/analytics/ComparativeAnalytics';
import PredictiveAnalytics from '../components/analytics/PredictiveAnalytics';

const Insights: React.FC = () => {
  const { betHistory } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [view, setView] = useState<'story' | 'data'>('story');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate narrative content based on bet history
  const generateNarrative = (stage: number) => {
    if (betHistory.length === 0) {
      return "Start your journey by placing your first bet. We'll analyze your behavior and help you understand your betting style.";
    }

    const totalBets = betHistory.length;
    const winRate = (betHistory.filter(bet => bet.outcome === 'win').length / totalBets) * 100;
    const avgRisk = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / totalBets;

    switch (stage) {
      case 0:
        return `You've placed ${totalBets} bets so far. Your win rate of ${winRate.toFixed(1)}% shows ${
          winRate > 50 ? "promising potential" : "room for improvement"
        }.`;
      case 1:
        const totalWon = betHistory.filter(bet => bet.outcome === 'win').reduce((sum, bet) => sum + bet.winAmount, 0);
        const totalLost = betHistory.filter(bet => bet.outcome === 'loss').reduce((sum, bet) => sum + bet.betAmount, 0);
        return `Your financial journey shows ${
          totalWon > totalLost ? "positive growth" : "some challenges"
        }. Keep analyzing your patterns to improve your results.`;
      case 2:
        return `Your average risk level of ${avgRisk.toFixed(1)}% indicates ${
          avgRisk > 50 ? "an aggressive approach" : "a conservative strategy"
        }. Understanding this helps in making better decisions.`;
      case 3:
        return `Your betting patterns reveal ${
          winRate > 50 ? "strong decision-making" : "opportunities for improvement"
        }. Focus on maintaining consistent risk levels.`;
      case 4:
        return `Based on your current trajectory, ${
          winRate > 50 ? "you're on a promising path" : "there's potential for growth"
        }. Continue learning and adapting your strategy.`;
      default:
        return "Your journey continues to evolve. Keep analyzing and improving your approach.";
    }
  };

  // Journey stages that combine narrative and analytics
  const stages = [
    {
      title: "Your Betting Origins",
      narrative: "The Beginning of Your Journey",
      analyticsComponent: <BehavioralAnalysis />,
    },
    {
      title: "Financial Evolution",
      narrative: "Your Path to Mastery",
      analyticsComponent: <FinancialMetrics />,
    },
    {
      title: "Pattern Discovery",
      narrative: "Understanding Your Style",
      analyticsComponent: <BettingPatterns />,
    },
    {
      title: "Risk & Reward",
      narrative: "Your Strategic Approach",
      analyticsComponent: <PatternRecognition />,
    },
    {
      title: "Future Horizons",
      narrative: "What Lies Ahead",
      analyticsComponent: <PredictiveAnalytics />,
    }
  ];

  const handleViewToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setView(prev => prev === 'story' ? 'data' : 'story');
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <Layout>
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Betting Journey</h1>
          <button
            onClick={handleViewToggle}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            View as {view === 'story' ? 'Analytics' : 'Story'}
          </button>
        </div>

        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {view === 'story' ? (
            <div className="space-y-8">
              {stages.map((stage, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="prose dark:prose-invert">
                      <h3 className="text-xl mb-4">{stage.narrative}</h3>
                      <p className="text-lg">{generateNarrative(index)}</p>
                    </div>
                    <div className="transition-transform hover:scale-105">
                      {stage.analyticsComponent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <BehavioralAnalysis />
              <FinancialMetrics />
              <BettingPatterns />
              <PatternRecognition />
              <PredictiveAnalytics />
              <ComparativeAnalytics />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Insights; 