import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Tour steps with descriptions of each analytics section
const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Analytics!',
    description: 'This guided tour will help you understand all the features available in the analytics dashboard.',
    target: null
  },
  {
    id: 'overview',
    title: 'Analytics Overview',
    description: 'This section provides a high-level summary of your betting activity including total bets, win rate, and average risk level.',
    target: 'analytics-overview'
  },
  {
    id: 'behavioral',
    title: 'Behavioral Analysis',
    description: 'Understand your betting behavior, including frequency, risk appetite, and emotional patterns. This helps identify potential unhealthy habits.',
    target: 'behavioral-analysis'
  },
  {
    id: 'financial',
    title: 'Financial Metrics',
    description: 'Track your financial performance including win/loss ratios, profit/loss, stake sizing, and risk metrics to evaluate your betting strategies.',
    target: 'financial-metrics'
  },
  {
    id: 'patterns',
    title: 'Betting Patterns',
    description: 'Discover your game preferences, success patterns, time patterns, and loss recovery behaviors to optimize your betting approach.',
    target: 'betting-patterns'
  },
  {
    id: 'prediction',
    title: 'Predictive Analytics',
    description: 'See future projections based on your current betting patterns to understand the long-term implications of your habits.',
    target: 'predictive-analytics'
  },
  {
    id: 'comparative',
    title: 'Comparative Analytics',
    description: 'Compare your betting metrics against responsible gambling benchmarks to see how your habits align with recommended practices.',
    target: 'comparative-analytics'
  },
  {
    id: 'goals',
    title: 'Goal Setting',
    description: 'Set and track personal responsible gambling goals to encourage healthier betting habits over time.',
    target: 'goal-setting'
  },
  {
    id: 'patterns-recognition',
    title: 'Pattern Recognition',
    description: 'Advanced algorithms identify potentially problematic patterns in your betting behavior and provide early warnings.',
    target: 'pattern-recognition'
  },
  {
    id: 'tips',
    title: 'Responsible Gambling Tips',
    description: 'Review general guidelines for maintaining healthy gambling habits and avoiding problematic behaviors.',
    target: 'responsible-tips'
  }
];

interface GuidedTourProps {
  onComplete: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const currentTourStep = tourSteps[currentStep];

  // Function to scroll to the target element
  useEffect(() => {
    const targetId = currentTourStep.target;
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        // Add highlight to element
        element.classList.add('tour-highlight');
        
        // Scroll to the element with offset for the fixed header
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight from previous elements
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, currentTourStep.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour complete
      setIsVisible(false);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto z-50 w-11/12 max-w-xl">
      <div className={`rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-5`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">{currentTourStep.title}</h3>
          <button 
            onClick={handleSkip}
            className={`text-sm px-3 py-1 rounded ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Skip Tour
          </button>
        </div>
        
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentTourStep.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full w-6 ${
                  index === currentStep 
                    ? isDarkMode ? 'bg-blue-500' : 'bg-blue-600' 
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className={`px-4 py-2 rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour; 