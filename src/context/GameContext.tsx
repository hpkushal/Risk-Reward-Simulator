import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our bet events
export interface BetEvent {
  id: string;
  name: string;
  multiplier: number;
  winChance: number;
  minBet: number;
  maxBet: number | null;
  riskLevel: 'Low' | 'Medium' | 'High';
  icon: string;
  description: string;
}

// Define types for persona
export interface Persona {
  id: string;
  name: string;
  description: string;
  maxBetPercentage: number;
  riskRange: {
    min: number;
    max: number;
  };
  icon: string;
  color: string;
  traits: string[];
}

// Define types for bet history
export interface BetHistory {
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

// Define game state type
export type GameState = 'playing' | 'won' | 'lost';

// Define context type
interface GameContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  currentRisk: number;
  setCurrentRisk: React.Dispatch<React.SetStateAction<number>>;
  betEvents: BetEvent[];
  personas: Persona[];
  currentPersona: Persona;
  betHistory: BetHistory[];
  gameState: GameState;
  placeBet: (eventId: string, amount: number) => boolean;
  calculateRisk: (eventId: string, amount: number) => number;
  resetGame: () => void;
  isProcessingBet: boolean;
}

// Define bet events
const betEvents: BetEvent[] = [
  {
    id: 'coin-flip',
    name: 'Coin Flip',
    multiplier: 2.0,
    winChance: 0.5,
    minBet: 10,
    maxBet: null,
    riskLevel: 'Low',
    icon: '🪙',
    description: 'Heads or tails? Classic 50/50 chance to double your money.',
  },
  {
    id: 'dice-roll',
    name: 'Dice Roll',
    multiplier: 6.0,
    winChance: 0.166,
    minBet: 50,
    maxBet: 2000,
    riskLevel: 'Medium',
    icon: '🎲',
    description: 'Roll a six to win big! Can you beat the odds?',
  },
  {
    id: 'bullseye',
    name: 'Bullseye',
    multiplier: 3.0,
    winChance: 0.33,
    minBet: 30,
    maxBet: 1500,
    riskLevel: 'Low',
    icon: '🎯',
    description: 'Hit the target and triple your bet. Steady hands win.',
  },
  {
    id: 'roulette',
    name: 'Roulette',
    multiplier: 35.0,
    winChance: 0.027,
    minBet: 100,
    maxBet: 1000,
    riskLevel: 'High',
    icon: '🎰',
    description: 'Hit your number and win 35x your bet! High risk, high reward.',
  },
  {
    id: 'sports-match',
    name: 'Sports Match',
    multiplier: 3.5,
    winChance: 0.3,
    minBet: 25,
    maxBet: 5000,
    riskLevel: 'Medium',
    icon: '⚽',
    description: 'Bet on the underdog team and get 3.5x your money if they win.',
  },
  {
    id: 'mega-jackpot',
    name: 'Mega Jackpot',
    multiplier: 20.0,
    winChance: 0.05,
    minBet: 200,
    maxBet: 2000,
    riskLevel: 'High',
    icon: '💰',
    description: 'Go for the mega jackpot! Low chance but massive rewards await.',
  }
];

// Define personas
const personas: Persona[] = [
  {
    id: 'baby-betsy',
    name: 'Baby Betsy',
    description: 'Safe bets, max 10% bankroll',
    maxBetPercentage: 0.1,
    riskRange: {
      min: 0,
      max: 30,
    },
    icon: '👶',
    color: 'text-green-500',
    traits: ['Cautious', 'Smart', 'Patient'],
  },
  {
    id: 'midlife-crisis-mike',
    name: 'Midlife Crisis Mike',
    description: 'Moderate risk, max 30% bankroll',
    maxBetPercentage: 0.3,
    riskRange: {
      min: 31,
      max: 70,
    },
    icon: '👨‍💼',
    color: 'text-yellow-500',
    traits: ['Impulsive', 'Calculated', 'Strategic'],
  },
  {
    id: 'yolo-yolanda',
    name: 'YOLO Yolanda',
    description: 'High risk, often all-in',
    maxBetPercentage: 1.0,
    riskRange: {
      min: 71,
      max: 100,
    },
    icon: '🤪',
    color: 'text-red-500',
    traits: ['Reckless', 'Daring', 'All or Nothing'],
  },
];

// Create context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(1000);
  const [currentRisk, setCurrentRisk] = useState<number>(15); // Default to low risk
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isProcessingBet, setIsProcessingBet] = useState<boolean>(false);
  
  // Determine the current persona based on risk level
  const getCurrentPersona = (): Persona => {
    const persona = personas.find(
      (p) => currentRisk >= p.riskRange.min && currentRisk <= p.riskRange.max
    );
    return persona || personas[0]; // Default to Baby Betsy if no match
  };
  
  // Get current persona based on risk level
  const currentPersona = getCurrentPersona();

  // Calculate risk percentage for a bet
  const calculateRisk = (eventId: string, betAmount: number): number => {
    const event = betEvents.find((e) => e.id === eventId);
    if (!event || balance <= 0) return 0;

    // Bet Size Factor (50%)
    const betSizeFactor = Math.min(betAmount / balance, 1);
    
    // Event Probability Factor (30%)
    const eventProbabilityFactor = 1 - event.winChance;
    
    // Loss Impact Factor (20%)
    const potentialLoss = betAmount;
    const lossImpactFactor = Math.min(potentialLoss / balance, 1);
    
    // Calculate total risk
    const riskPercentage = (betSizeFactor * 50) + 
                          (eventProbabilityFactor * 30) + 
                          (lossImpactFactor * 20);
    
    return Math.min(Math.round(riskPercentage), 100);
  };

  // Place a bet
  const placeBet = (eventId: string, amount: number) => {
    const event = betEvents.find((e) => e.id === eventId);
    if (!event || gameState !== 'playing') return false;
    
    if (amount < event.minBet || (event.maxBet !== null && amount > event.maxBet)) {
      console.log(`Invalid bet amount. Min: $${event.minBet}${event.maxBet ? `, Max: $${event.maxBet}` : ''}`);
      return false;
    }
    
    if (amount > balance) {
      console.log('Not enough balance');
      return false;
    }
    
    // Calculate risk before placing bet
    const riskPercentage = calculateRisk(eventId, amount);
    
    // Start processing animation
    setIsProcessingBet(true);
    
    // Determine outcome randomly based on probability
    const randomValue = Math.random();
    const isWin = randomValue < event.winChance;
    
    // Calculate win/loss amount
    const winAmount = isWin ? amount * (event.multiplier - 1) : -amount;
    
    // Update balance
    const newBalance = balance + winAmount;
    setBalance(newBalance);
    
    // Add to history
    const historyEntry: BetHistory = {
      id: `bet-${Date.now()}`,
      eventId,
      eventName: event.name,
      betAmount: amount,
      outcome: isWin ? 'win' : 'loss',
      winAmount: isWin ? amount * (event.multiplier - 1) : 0,
      balanceAfter: newBalance,
      riskPercentage,
      timestamp: new Date(),
    };
    
    setBetHistory((prev) => [historyEntry, ...prev]);
    
    // Update game state if needed
    if (newBalance <= 0) {
      setGameState('lost');
    } else if (newBalance >= 10000) {
      setGameState('won');
    }
    
    // Update current risk based on bet result and new balance
    setCurrentRisk(calculateRisk(eventId, amount * 0.5)); // Use half of previous bet as reference
    
    // End processing animation
    setTimeout(() => {
      setIsProcessingBet(false);
    }, 1000);
    
    return isWin;
  };

  // Reset the game
  const resetGame = () => {
    setBalance(1000);
    setBetHistory([]);
    setCurrentRisk(15);
    setGameState('playing');
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        setBalance,
        currentRisk,
        setCurrentRisk,
        betEvents,
        personas,
        currentPersona,
        betHistory,
        gameState,
        placeBet,
        calculateRisk,
        resetGame,
        isProcessingBet,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 