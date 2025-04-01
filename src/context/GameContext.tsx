import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Represents a betting event in the game
 * @interface BetEvent
 */
export interface BetEvent {
  /** Unique identifier for the bet event */
  id: string;
  /** Display name of the bet event */
  name: string;
  /** Payout multiplier for a winning bet */
  multiplier: number;
  /** Probability of winning (0-1) */
  winChance: number;
  /** Minimum bet amount required */
  minBet: number;
  /** Maximum bet amount allowed, null for no limit */
  maxBet: number | null;
  /** Risk classification of the bet */
  riskLevel: 'Low' | 'Medium' | 'High';
  /** Emoji icon representing the bet */
  icon: string;
  /** Description of the bet event */
  description: string;
}

/**
 * Represents a betting persona/profile
 * @interface Persona
 */
export interface Persona {
  /** Unique identifier for the persona */
  id: string;
  /** Display name of the persona */
  name: string;
  /** Short description of the persona */
  description: string;
  /** Maximum percentage of bankroll this persona typically bets */
  maxBetPercentage: number;
  /** Risk range this persona operates within */
  riskRange: {
    /** Minimum risk percentage */
    min: number;
    /** Maximum risk percentage */
    max: number;
  };
  /** Emoji icon representing the persona */
  icon: string;
  /** CSS color class for the persona */
  color: string;
  /** Character traits of the persona */
  traits: string[];
}

/**
 * Represents a historical bet
 * @interface BetHistory
 */
export interface BetHistory {
  /** Unique identifier for the bet */
  id: string;
  /** Reference to the event ID */
  eventId: string;
  /** Name of the event */
  eventName: string;
  /** Amount wagered */
  betAmount: number;
  /** Outcome of the bet */
  outcome: 'win' | 'loss';
  /** Amount won (positive) or lost (negative) */
  winAmount: number;
  /** Balance after the bet was settled */
  balanceAfter: number;
  /** Risk percentage of the bet */
  riskPercentage: number;
  /** Timestamp when the bet was placed */
  timestamp: Date;
}

/**
 * Possible states of the game
 * @typedef {('playing'|'won'|'lost')} GameState
 */
export type GameState = 'playing' | 'won' | 'lost';

/**
 * Game context interface
 * @interface GameContextType
 */
interface GameContextType {
  /** Current player balance */
  balance: number;
  /** Function to update the balance */
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  /** Current risk level (0-100) */
  currentRisk: number;
  /** Function to update the risk level */
  setCurrentRisk: React.Dispatch<React.SetStateAction<number>>;
  /** Available betting events */
  betEvents: BetEvent[];
  /** Available personas */
  personas: Persona[];
  /** Current active persona based on risk level */
  currentPersona: Persona;
  /** History of all bets placed */
  betHistory: BetHistory[];
  /** Current state of the game */
  gameState: GameState;
  /** Function to place a bet */
  placeBet: (eventId: string, amount: number) => boolean;
  /** Function to calculate risk for a potential bet */
  calculateRisk: (eventId: string, amount: number) => number;
  /** Function to reset the game */
  resetGame: () => void;
  /** Whether a bet is currently being processed */
  isProcessingBet: boolean;
}

/**
 * Available betting events in the game
 * @const {BetEvent[]} betEvents
 */
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

/**
 * Available betting personas
 * @const {Persona[]} personas
 */
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

/**
 * Game context with default values
 * @const {React.Context<GameContextType | undefined>} GameContext
 */
const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Game provider component
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Game provider component
 */
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State variables
  const [balance, setBalance] = useState<number>(1000);
  const [currentRisk, setCurrentRisk] = useState<number>(15); // Default to low risk
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isProcessingBet, setIsProcessingBet] = useState<boolean>(false);
  
  /**
   * Determines the current persona based on risk level
   * @returns {Persona} The matching persona or default
   */
  const getCurrentPersona = (): Persona => {
    const persona = personas.find(
      (p) => currentRisk >= p.riskRange.min && currentRisk <= p.riskRange.max
    );
    return persona || personas[0]; // Default to Baby Betsy if no match
  };
  
  // Get current persona based on risk level
  const currentPersona = getCurrentPersona();

  /**
   * Calculates risk percentage for a potential bet
   * @param {string} eventId - ID of the bet event
   * @param {number} betAmount - Amount to be bet
   * @returns {number} Risk percentage (0-100)
   */
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

  /**
   * Places a bet and determines the outcome
   * @param {string} eventId - ID of the bet event
   * @param {number} amount - Amount to be bet
   * @returns {boolean} Whether the bet was successfully placed
   */
  const placeBet = (eventId: string, amount: number): boolean => {
    const event = betEvents.find((e) => e.id === eventId);
    if (!event || gameState !== 'playing') return false;
    
    // Validate bet amount against event limits
    if (amount < event.minBet || (event.maxBet !== null && amount > event.maxBet)) {
      console.log(`Invalid bet amount. Min: $${event.minBet}${event.maxBet ? `, Max: $${event.maxBet}` : ''}`);
      return false;
    }
    
    // Check if player has enough balance
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
    
    // Generate a unique ID for this bet
    const betId = `bet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Record bet in history
    const betRecord: BetHistory = {
      id: betId,
      eventId,
      eventName: event.name,
      betAmount: amount,
      outcome: isWin ? 'win' : 'loss',
      winAmount,
      balanceAfter: newBalance,
      riskPercentage,
      timestamp: new Date(),
    };
    
    setBetHistory([...betHistory, betRecord]);
    
    // Check game state after bet
    if (newBalance >= 10000) {
      setGameState('won');
    } else if (newBalance <= 0) {
      setGameState('lost');
    }
    
    // Finish processing animation after a delay
    setTimeout(() => {
      setIsProcessingBet(false);
    }, 1000);
    
    return true;
  };
  
  /**
   * Resets the game to its initial state
   */
  const resetGame = () => {
    setBalance(1000);
    setCurrentRisk(15);
    setBetHistory([]);
    setGameState('playing');
  };
  
  // Context value
  const value: GameContextType = {
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
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * Custom hook to use the game context
 * @returns {GameContextType} The game context
 * @throws {Error} If used outside of a GameProvider
 */
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 