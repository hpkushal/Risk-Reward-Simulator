import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import Layout from '../components/layout/Layout';
import confetti from 'canvas-confetti';

// Define journey stages with more immersive chapter titles
const journeyStages = [
  { id: 'beginning', title: 'Chapter 1: The First Bet', subtitle: 'Every legend has a beginning...', thresholdBets: 0, icon: '🎲', color: 'from-blue-400 to-indigo-500' },
  { id: 'exploration', title: 'Chapter 2: Finding Your Style', subtitle: 'The gambler discovers their true nature', thresholdBets: 5, icon: '🧭', color: 'from-green-400 to-emerald-500' },
  { id: 'development', title: 'Chapter 3: Risk & Reward', subtitle: 'Facing the abyss of chance', thresholdBets: 15, icon: '⚖️', color: 'from-yellow-400 to-amber-500' },
  { id: 'mastery', title: 'Chapter 4: The High Roller', subtitle: 'Fortune favors the bold', thresholdBets: 30, icon: '👑', color: 'from-orange-400 to-red-500' },
  { id: 'legacy', title: 'Chapter 5: The Legend', subtitle: 'Your name echoes through the halls of gambling history', thresholdBets: 50, icon: '🏆', color: 'from-purple-400 to-pink-500' }
];

// Define character archetypes with more personality
const archetypes = [
  { 
    id: 'cautious', 
    title: 'The Calculated Strategist', 
    riskThreshold: 30, 
    description: 'You play the long game, building your empire brick by brick. While others chase windfall profits, your methodical approach ensures steady growth.',
    icon: '🧠',
    traits: ['Analytical', 'Patient', 'Methodical'],
    quote: `"Fortune favors the prepared mind."`
  },
  { 
    id: 'balanced', 
    title: 'The Tactful Opportunist', 
    riskThreshold: 60, 
    description: 'You know when to hold and when to fold. Your balanced approach allows you to seize opportunities while avoiding catastrophic losses.',
    icon: '⚖️',
    traits: ['Adaptable', 'Measured', 'Versatile'],
    quote: `"Life is all about balance. You don't have to go all-in every time."`
  },
  { 
    id: 'daredevil', 
    title: 'The Fearless Gambler', 
    riskThreshold: 100, 
    description: 'You live for the rush! High stakes and heart-stopping bets are your playground. When you win big, the whole casino knows your name.',
    icon: '🔥',
    traits: ['Bold', 'Charismatic', 'Unpredictable'],
    quote: `"Those who dare, win. Those who don't, watch from the sidelines."`
  }
];

// Define era themes based on betting behavior
const eraThemes = [
  { id: 'caution', title: 'The Age of Caution', riskRange: [0, 30], icon: '🛡️', description: 'A time of careful calculation and risk aversion.' },
  { id: 'growth', title: 'The Growth Era', riskRange: [31, 50], icon: '📈', description: 'A period of balanced decisions and consistent growth.' },
  { id: 'golden', title: 'The Golden Age', riskRange: [51, 70], icon: '✨', description: 'Your prime gambling years, marked by confidence and success.' },
  { id: 'daring', title: 'The Daring Epoch', riskRange: [71, 85], icon: '🚀', description: 'A time when you pushed boundaries and took magnificent chances.' },
  { id: 'legendary', title: 'The Legendary Phase', riskRange: [86, 100], icon: '🌟', description: 'Few gamblers ever reach this level of audacity and flair.' }
];

// Define story-based achievement badges
const achievementBadges = [
  { id: 'first-win', title: 'First Victory', description: 'You never forget your first win', icon: '🌟', condition: (betHistory: any[]) => betHistory.some(bet => bet.outcome === 'win') },
  { id: 'comeback', title: 'The Comeback Kid', description: 'Lost 3 in a row, then won big', icon: '🔄', condition: (betHistory: any[]) => {
    if (betHistory.length < 4) return false;
    for (let i = 0; i < betHistory.length - 3; i++) {
      if (betHistory[i].outcome === 'loss' && 
          betHistory[i+1].outcome === 'loss' && 
          betHistory[i+2].outcome === 'loss' && 
          betHistory[i+3].outcome === 'win' && 
          betHistory[i+3].winAmount > betHistory[i+3].betAmount * 1.5) {
        return true;
      }
    }
    return false;
  }},
  { id: 'high-roller', title: 'High Roller', description: 'Placed a bet with 75%+ risk', icon: '💰', condition: (betHistory: any[]) => betHistory.some(bet => bet.riskPercentage >= 75) },
  { id: 'consistent', title: 'The Consistent One', description: 'Won 5 bets in a row', icon: '📊', condition: (betHistory: any[]) => {
    let maxStreak = 0;
    let currentStreak = 0;
    for (const bet of betHistory) {
      if (bet.outcome === 'win') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    return maxStreak >= 5;
  }},
  { id: 'golden-touch', title: 'The Golden Touch', description: 'Doubled your initial bankroll', icon: '👑', condition: (_: any[], balance: number) => balance >= 2000 }
];

// Define interfaces for better type safety
interface Bet {
  id: string;
  eventId: string;
  eventName: string;
  betAmount: number;
  outcome: 'win' | 'loss';
  winAmount: number;
  balanceAfter: number;
  riskPercentage: number;
  timestamp: Date;
}

interface KeyMoment {
  id: string;
  title: string;
  event: string;
  risk: number;
  impact: number;
  description: string;
  emoji: string;
}

interface JourneyPoint {
  id: string;
  index: number;
  balance: number;
  risk: number;
  event: string;
  win: boolean;
  amount: number;
  winAmount: number;
}

interface CharacterPeriod {
  index: number;
  avgRisk: number;
  winRate: number;
  startBalance: number;
  endBalance: number;
  growthRate: number;
  era: string;
  eraTheme: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const Journey: React.FC = () => {
  const { betHistory, balance } = useGame();
  
  const [currentStage, setCurrentStage] = useState(journeyStages[0]);
  const [archetype, setArchetype] = useState(archetypes[0]);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [journeyPath, setJourneyPath] = useState<JourneyPoint[]>([]);
  const [characterGrowth, setCharacterGrowth] = useState<CharacterPeriod[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [showStoryboard, setShowStoryboard] = useState(false);
  
  // Animation effects for achievements
  useEffect(() => {
    if (activeAchievement) {
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Clear active achievement after display
      const timer = setTimeout(() => {
        setActiveAchievement(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [activeAchievement]);
  
  // Determine current journey stage based on number of bets
  useEffect(() => {
    const numBets = betHistory.length;
    const stage = journeyStages
      .slice()
      .reverse()
      .find(stage => numBets >= stage.thresholdBets) || journeyStages[0];
    
    setCurrentStage(stage);
  }, [betHistory]);
  
  // Determine player archetype based on average risk
  useEffect(() => {
    if (betHistory.length === 0) return;
    
    // Calculate average risk from betting history
    const totalRisk = betHistory.reduce((sum: number, bet: Bet) => {
      return sum + bet.riskPercentage;
    }, 0);
    
    const avgRisk = totalRisk / betHistory.length;
    
    // Find matching archetype
    const matchedArchetype = archetypes
      .slice()
      .reverse()
      .find(a => avgRisk <= a.riskThreshold) || archetypes[0];
    
    setArchetype(matchedArchetype);
  }, [betHistory]);
  
  // Identify key moments in betting history
  useEffect(() => {
    if (betHistory.length === 0) return;
    
    // Sort bets by impact (win/loss amount)
    const sortedBets = [...betHistory].sort((a, b) => {
      const aImpact = a.outcome === 'win' ? a.winAmount : -a.betAmount;
      const bImpact = b.outcome === 'win' ? b.winAmount : -b.betAmount;
      return Math.abs(bImpact) - Math.abs(aImpact);
    }).reverse().slice(0, 5);
    
    // Format key moments with more narrative flair
    const moments = sortedBets.map((bet: Bet) => {
      const risk = bet.riskPercentage;
      const event = bet.eventName || 'Unknown Event';
      const impact = bet.outcome === 'win' ? bet.winAmount : -bet.betAmount;
      
      // Determine emoji based on outcome and risk
      let emoji = '📊';
      if (bet.outcome === 'win') {
        emoji = risk > 70 ? '🤯' : risk > 40 ? '🥳' : '😊';
      } else {
        emoji = risk > 70 ? '💔' : risk > 40 ? '😭' : '😕';
      }
      
      return {
        id: bet.id,
        title: bet.outcome === 'win' 
          ? risk > 70 ? 'Legendary Victory' : risk > 40 ? 'Triumphant Win' : 'Steady Success'
          : risk > 70 ? 'Devastating Blow' : risk > 40 ? 'Painful Loss' : 'Minor Setback',
        event,
        risk,
        impact,
        emoji,
        description: bet.outcome === 'win' 
          ? `Your ${risk > 70 ? 'heart-stopping' : risk > 40 ? 'bold' : 'calculated'} bet on ${event} paid off ${risk > 70 ? 'SPECTACULARLY' : 'nicely'}, netting you $${bet.winAmount.toFixed(2)}! ${risk > 60 ? 'The casino still talks about this one!' : ''}`
          : `Your ${risk > 70 ? 'audacious' : risk > 40 ? 'risky' : 'cautious'} approach on ${event} didn't pan out, resulting in a $${bet.betAmount.toFixed(2)} loss. ${risk > 70 ? 'A moment of silence for this epic gamble.' : ''}`
      };
    });
    
    setKeyMoments(moments);
  }, [betHistory]);
  
  // Generate journey path data
  useEffect(() => {
    if (betHistory.length === 0) return;
    
    // Map betting history to journey points
    const path = betHistory.map((bet: Bet, index: number) => {
      return {
        id: bet.id,
        index,
        balance: bet.balanceAfter,
        risk: bet.riskPercentage,
        event: bet.eventName || 'Unknown Event',
        win: bet.outcome === 'win',
        amount: bet.betAmount,
        winAmount: bet.winAmount,
      };
    });
    
    setJourneyPath(path);
  }, [betHistory]);
  
  // Track character growth over time with themed eras
  useEffect(() => {
    if (betHistory.length < 5) return;
    
    // Calculate risk trends in 5-bet windows
    const periods: CharacterPeriod[] = [];
    let startBalance = 1000; // Initial balance
    
    for (let i = 0; i < betHistory.length; i += 5) {
      const windowBets = betHistory.slice(i, i + 5);
      if (windowBets.length < 3) continue; // Skip incomplete windows
      
      // Calculate average risk for this window
      const avgRisk = windowBets.reduce((sum: number, bet: Bet) => {
        return sum + bet.riskPercentage;
      }, 0) / windowBets.length;
      
      // Calculate win rate for this window
      const wins = windowBets.filter((bet: Bet) => bet.outcome === 'win').length;
      const winRate = (wins / windowBets.length) * 100;
      
      // Use the last balance as end balance
      const endBalance = windowBets[windowBets.length - 1].balanceAfter;
      
      // Find matching era theme
      const eraTheme = eraThemes
        .find(era => avgRisk >= era.riskRange[0] && avgRisk <= era.riskRange[1]) || eraThemes[0];
      
      periods.push({
        index: Math.floor(i / 5),
        avgRisk,
        winRate,
        startBalance: i === 0 ? 1000 : betHistory[i-1].balanceAfter, // Use previous bet's balance or initial balance
        endBalance,
        growthRate: ((endBalance - startBalance) / startBalance) * 100,
        era: eraTheme.title,
        eraTheme
      });
      
      startBalance = endBalance; // Set start balance for next period
    }
    
    setCharacterGrowth(periods);
  }, [betHistory]);
  
  // Calculate achievements
  useEffect(() => {
    if (betHistory.length === 0) return;
    
    const newAchievements = achievementBadges.map(badge => {
      const unlocked = badge.condition(betHistory, balance);
      return {
        id: badge.id,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined
      };
    });
    
    // Check for newly unlocked achievements
    const previousAchievements = achievements;
    setAchievements(newAchievements);
    
    if (previousAchievements.length > 0) {
      const newlyUnlocked = newAchievements.find(na => 
        na.unlocked && !previousAchievements.find(pa => pa.id === na.id && pa.unlocked)
      );
      
      if (newlyUnlocked) {
        setActiveAchievement(newlyUnlocked);
      }
    }
  }, [betHistory, balance]);
  
  // Generate a character biography based on betting history
  const generateBiography = () => {
    if (betHistory.length === 0) {
      return "Your gambling journey awaits its first chapter. Place your first bet to begin your legend!";
    }
    
    let bio = `Your story begins with $1,000 in hand and dreams of glory. `;
    
    // Add character type with more flair
    bio += `As ${archetype.title.toLowerCase()}, ${archetype.description} `;
    
    // Add journey summary with narrative flair
    const wins = betHistory.filter((b: Bet) => b.outcome === 'win').length;
    const winRate = (wins / betHistory.length) * 100;
    bio += `You've weathered ${betHistory.length} bets on your journey, emerging victorious ${wins} times (${Math.round(winRate)}% win rate). `;
    
    // Add era information if available
    if (characterGrowth.length > 0) {
      const lastEra = characterGrowth[characterGrowth.length - 1];
      bio += `Your saga is currently in "${lastEra.era}" - ${lastEra.eraTheme.description} `;
    }
    
    // Add biggest win/loss with more dramatic flair
    if (keyMoments.length > 0) {
      const biggestWin = keyMoments.find(m => m.impact > 0);
      const biggestLoss = keyMoments.find(m => m.impact < 0);
      
      if (biggestWin) {
        bio += `The tale of your $${Math.abs(biggestWin.impact).toFixed(2)} triumph on ${biggestWin.event} has become legend. `;
      }
      
      if (biggestLoss) {
        bio += `The crushing $${Math.abs(biggestLoss.impact).toFixed(2)} defeat at ${biggestLoss.event} tested your resolve. `;
      }
    }
    
    // Add current status with more narrative
    bio += `Today, you stand with ${balance > 1000 ? 'an impressive' : 'a modest'} $${balance.toFixed(2)} in your war chest. `;
    
    // Add future projection with story elements
    if (balance > 1000) {
      bio += `The path to your $10,000 goal shines bright before you. Glory awaits!`;
    } else if (balance < 500) {
      bio += `Every great hero faces a moment of crisis. This is yours. Will you rise from the ashes?`;
    } else {
      bio += `Your story is still being written. The next chapter depends on the choices you make.`;
    }
    
    return bio;
  };
  
  // Render character journey with narrative elements
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Achievement Popup */}
        {activeAchievement && (
          <div className="fixed top-20 right-5 bg-gradient-to-r from-yellow-300 to-amber-500 text-black p-4 rounded-lg shadow-lg z-50 animate-bounce-once max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{activeAchievement.icon}</div>
              <div>
                <h3 className="font-bold">Achievement Unlocked!</h3>
                <p className="text-sm font-medium">{activeAchievement.title}</p>
                <p className="text-xs opacity-75">{activeAchievement.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Header - More dramatic title */}
        <div className={`bg-gradient-to-r ${currentStage.color} rounded-xl p-6 mb-10 text-white shadow-lg transform transition-all duration-500 hover:scale-[1.02]`}>
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{currentStage.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{currentStage.title}</h1>
              <p className="text-xl opacity-90 italic">{currentStage.subtitle}</p>
            </div>
          </div>
          <div className="w-full bg-white/30 h-4 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-white h-4 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${Math.min(100, (betHistory.length / journeyStages[journeyStages.length - 1].thresholdBets) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-2 px-1 text-white/80">
            <span>Chapter 1</span>
            <span>Chapter 5</span>
          </div>
        </div>

        {/* Story Navigation */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-10">
          <button 
            onClick={() => setShowStoryboard(!showStoryboard)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl text-white font-bold text-center shadow-md hover:shadow-lg transition-all"
          >
            {showStoryboard ? "Return to Journey" : "View Your Storyboard"}
          </button>
          
          <div className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-75">Current Balance</h3>
                <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          
          <div className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 p-4 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-75">Total Bets Placed</h3>
                <p className="text-2xl font-bold">{betHistory.length}</p>
              </div>
              <div className="text-4xl">🎲</div>
            </div>
          </div>
        </div>

        {showStoryboard ? (
          /* Storyboard View - Show narrative chapters and path */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Betting Story</h2>
            
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500"></div>
              
              {/* Timeline events */}
              {journeyPath.map((point, index) => (
                <div key={point.id} className={`flex items-center mb-10 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <h3 className="text-xl font-bold">{point.event}</h3>
                    <p className={`text-lg font-medium ${point.win ? 'text-green-500' : 'text-red-500'}`}>
                      {point.win ? `+$${point.winAmount.toFixed(2)}` : `-$${point.amount.toFixed(2)}`}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Risk Level: {point.risk}%</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${point.win ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {point.win ? '✓' : '✗'}
                    </div>
                  </div>
                  
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                    <p className="text-gray-600 dark:text-gray-400">Balance: ${point.balance.toFixed(2)}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {point.win 
                        ? `Your confidence grew after this win.`
                        : `This loss taught you valuable lessons.`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Main Journey View */
          <>
            {/* Biography Card - More visually engaging */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border-t-4 border-blue-600 transform transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-5 text-4xl text-white shadow-lg">
                  {archetype.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">Your Gambling Biography</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {generateBiography()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Character Archetype - More game-like presentation */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-blue-600">Your Gambling Identity</h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-500 hover:shadow-2xl">
                <div className="md:flex items-start space-y-6 md:space-y-0 md:space-x-6">
                  {/* Left side - avatar */}
                  <div className="md:w-1/3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
                      <div className="text-8xl mb-4 mx-auto">{archetype.icon}</div>
                      <h3 className="text-2xl font-bold mb-2">{archetype.title}</h3>
                      <div className="flex justify-center space-x-2 mb-4">
                        {archetype.traits.map((trait: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-sm">{trait}</span>
                        ))}
                      </div>
                      <p className="italic text-sm">"{archetype.quote}"</p>
                    </div>
                  </div>
                  
                  {/* Right side - stats */}
                  <div className="md:w-2/3">
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{archetype.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center shadow transform transition-transform hover:scale-105">
                        <h4 className="font-semibold mb-2 text-gray-500 dark:text-gray-400">Risk Tolerance</h4>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {betHistory.length > 0 ? 
                            Math.round(betHistory.reduce((sum: number, bet: Bet) => sum + bet.riskPercentage, 0) / betHistory.length) 
                            : 0}%
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center shadow transform transition-transform hover:scale-105">
                        <h4 className="font-semibold mb-2 text-gray-500 dark:text-gray-400">Win Rate</h4>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {betHistory.length > 0 ? 
                            Math.round((betHistory.filter((b: Bet) => b.outcome === 'win').length / betHistory.length) * 100) 
                            : 0}%
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center shadow transform transition-transform hover:scale-105">
                        <h4 className="font-semibold mb-2 text-gray-500 dark:text-gray-400">Total Bets</h4>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{betHistory.length}</div>
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <h4 className="font-semibold mb-3 text-lg">Achievements Unlocked</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className={`p-2 rounded text-center ${achievement.unlocked 
                            ? 'bg-gradient-to-r from-yellow-300 to-amber-500 text-gray-900 shadow-md' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}
                        >
                          <div className="text-2xl mb-1">{achievement.icon}</div>
                          <div className={`text-xs font-medium ${achievement.unlocked ? '' : 'opacity-50'}`}>{achievement.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Moments - More cinematic presentation */}
            {keyMoments.length > 0 && (
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-blue-600">Defining Moments</h2>
                <div className="space-y-4">
                  {keyMoments.map((moment) => (
                    <div 
                      key={moment.id} 
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 transform transition-all duration-500 hover:shadow-xl ${moment.impact > 0 ? 'border-green-500' : 'border-red-500'}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`text-5xl ${moment.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {moment.emoji}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-2 ${moment.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {moment.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                            {moment.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-500 dark:text-gray-400">Event:</span> {moment.event}
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-500 dark:text-gray-400">Risk Level:</span> {moment.risk}%
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-500 dark:text-gray-400">Impact:</span>{' '}
                              <span className={moment.impact > 0 ? 'text-green-500' : 'text-red-500'}>
                                {moment.impact > 0 ? '+' : ''}{moment.impact.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Character Growth - More visually styled */}
            {characterGrowth.length > 0 && (
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-blue-600">Your Character Evolution</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">The Eras of Your Gambling Legend</h3>
                  <div className="space-y-8">
                    {characterGrowth.map((period, index) => (
                      <div key={index} className="relative">
                        {/* Era connector line */}
                        {index < characterGrowth.length - 1 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 h-8 w-0.5 bg-blue-500 top-full"></div>
                        )}
                        
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-500 hover:shadow-xl">
                          <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="text-3xl">{period.eraTheme.icon}</div>
                            <h4 className="text-xl font-bold">{period.era}</h4>
                          </div>
                          
                          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 italic">
                            {period.eraTheme.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded text-center shadow">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Risk</div>
                              <div className="text-lg font-semibold">{Math.round(period.avgRisk)}%</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded text-center shadow">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Win Rate</div>
                              <div className="text-lg font-semibold">{Math.round(period.winRate)}%</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded text-center shadow">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Growth</div>
                              <div className={`text-lg font-semibold ${period.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {period.growthRate >= 0 ? '+' : ''}{Math.round(period.growthRate)}%
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded text-center shadow">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance Change</div>
                              <div className="text-lg font-semibold">
                                ${period.startBalance.toFixed(0)} → ${period.endBalance.toFixed(0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Alternative Timelines - More engaging presentation */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-blue-600">Alternate Realities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-800 transform transition-all duration-500 hover:shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-3 text-3xl">🛡️</div>
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">The Cautious Timeline</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    In a parallel universe where you took only low-risk bets (below 30%), your story would be different:
                  </p>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Balance</div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${Math.round(1000 * (1 + (betHistory.length * 0.05)))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">
                    "The path of caution led to steady growth, but fewer stories to tell..."
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl shadow-lg p-6 border border-red-100 dark:border-red-800 transform transition-all duration-500 hover:shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-200 dark:bg-red-800 rounded-full p-3 text-3xl">🔥</div>
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-300">The Daredevil Timeline</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    In a reality where you embraced maximum risk (above 70%), your fate would be:
                  </p>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Balance</div>
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        ${Math.round(Math.max(0, 1000 * (1 + (betHistory.length * 0.2 * (Math.random() > 0.6 ? 1 : -1)))))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">
                    "Live by the risk, die by the risk. Your legend would be short but spectacular..."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Journey Next Chapter - More epic presentation */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-blue-600">The Next Chapter</h2>
              <div className="bg-gradient-to-r from-purple-400 to-indigo-600 rounded-xl shadow-xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6 text-center">Your Quest Continues...</h3>
                
                <div className="max-w-2xl mx-auto">
                  <p className="text-xl mb-8 text-center">
                    {balance > 1000 
                      ? "Your path to becoming a gambling legend lies before you. Each bet brings you closer to eternal glory." 
                      : balance < 500 
                        ? "Every hero must face their darkest hour. This is yours. But remember, the greatest comeback stories begin at the bottom." 
                        : "You stand at the crossroads of fate. Your next decisions will define your legacy."}
                  </p>
                  
                  <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                    <div className="text-2xl font-semibold mb-4 text-center">
                      {balance > 1000 
                        ? "The Road to Mastery" 
                        : balance < 500 
                          ? "The Phoenix Rises" 
                          : "Finding Your Destiny"}
                    </div>
                    
                    <p className="text-lg mb-6 text-center">
                      {balance > 1000 
                        ? "Your successful approach has put you on a path to gambling mastery. The next chapter of your journey will test your ability to maintain discipline even as stakes rise." 
                        : balance < 500 
                          ? "From the ashes of defeat, legends are born. Your journey now enters a rebuilding phase, where careful strategy and resilience will determine your comeback."
                          : "You stand at a crossroads. Your next decisions will determine whether your story becomes one of triumph or caution."}
                    </p>
                    
                    <div className="text-center mb-2">
                      <span className="text-lg font-medium">Goal Progress: ${balance.toFixed(2)} / $10,000</span>
                    </div>
                    <div className="w-full bg-white/30 h-6 rounded-full mb-2">
                      <div 
                        className="bg-white h-6 rounded-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${Math.min(100, (balance / 10000) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm opacity-75">
                      {Math.round((balance / 10000) * 100)}% of the way to legendary status
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Journey; 