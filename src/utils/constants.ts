/**
 * Application-wide constants
 */

// Game settings
export const INITIAL_BALANCE = 1000;
export const GOAL_AMOUNT = 10000;

// Betting events
export const BETTING_EVENTS = [
  {
    id: 'coin-flip',
    name: 'Coin Flip',
    description: 'Heads or tails - a 50/50 chance to double your money.',
    multiplier: 2.0,
    probability: 0.5,
    riskLevel: 'Low',
    minBet: 10,
    icon: '🪙'
  },
  {
    id: 'dice-roll',
    name: 'Dice Roll',
    description: 'Guess a number from 1-6. Roll your number to win 6x your bet.',
    multiplier: 6.0,
    probability: 0.166,
    riskLevel: 'Medium',
    minBet: 50,
    icon: '🎲'
  },
  {
    id: 'bullseye',
    name: 'Bullseye',
    description: 'Hit the bullseye to win 3x your bet. About a 1/3 chance.',
    multiplier: 3.0,
    probability: 0.33,
    riskLevel: 'Low',
    minBet: 30,
    icon: '🎯'
  },
  {
    id: 'roulette',
    name: 'Roulette',
    description: 'Pick a number from 0-36. Win 35x your bet if it hits.',
    multiplier: 35.0,
    probability: 0.027,
    riskLevel: 'High',
    minBet: 100,
    icon: '🎰'
  },
  {
    id: 'stock-market',
    name: 'Stock Market',
    description: 'Predict if the market will go up. Win 10x if correct.',
    multiplier: 10.0,
    probability: 0.1,
    riskLevel: 'Medium',
    minBet: 200,
    icon: '📈'
  },
  {
    id: 'lottery',
    name: 'Lottery',
    description: 'Buy a ticket for a 1 in 1000 chance to win 1000x your bet.',
    multiplier: 1000.0,
    probability: 0.001,
    riskLevel: 'High',
    minBet: 1,
    icon: '🎟️'
  }
];

// Persona thresholds
export const PERSONA_THRESHOLDS = {
  BABY_BETSY: 30,
  MIDLIFE_CRISIS_MIKE: 70
};

// Risk level thresholds
export const RISK_LEVELS = {
  LOW: 30,
  MEDIUM: 70,
  HIGH: 100
};

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'virtualBetSimulator_gameState',
  THEME: 'virtualBetSimulator_theme',
  SOUND: 'virtualBetSimulator_sound',
  BETTING_GOALS: 'bettingGoals'
}; 