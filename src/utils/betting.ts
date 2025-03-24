/**
 * Utility functions for betting calculations
 */

/**
 * Calculate the risk percentage for a bet
 * @param betAmount - The amount being bet
 * @param balance - Current balance
 * @param eventProbability - Win probability of the event (0-1)
 * @returns Risk percentage (0-100)
 */
export const calculateRiskPercentage = (
  betAmount: number,
  balance: number,
  eventProbability: number
): number => {
  // Bet size factor: how much of your bankroll you're risking
  const betSizeFactor = betAmount / balance;
  
  // Event probability factor: higher for lower probability events
  const eventProbabilityFactor = 1 - eventProbability;
  
  // Loss impact factor: impact of losing this bet on your bankroll
  const lossImpactFactor = betAmount / balance;
  
  // Weighted calculation
  const risk = (betSizeFactor * 50) + 
               (eventProbabilityFactor * 30) + 
               (lossImpactFactor * 20);
  
  // Clamp between 0-100
  return Math.min(100, Math.max(0, risk * 100));
};

/**
 * Determine persona based on risk level
 * @param riskPercentage - The risk percentage (0-100)
 * @returns Persona name
 */
export const determinePersona = (riskPercentage: number): string => {
  if (riskPercentage <= 30) {
    return 'Baby Betsy';
  } else if (riskPercentage <= 70) {
    return 'Midlife Crisis Mike';
  } else {
    return 'YOLO Yolanda';
  }
};

/**
 * Calculate the maximum bet amount based on persona/risk level
 * @param balance - Current balance
 * @param riskPercentage - The risk percentage (0-100)
 * @returns Maximum bet amount
 */
export const calculateMaxBet = (balance: number, riskPercentage: number): number => {
  if (riskPercentage <= 30) {
    // Baby Betsy: max 10% of bankroll
    return balance * 0.1;
  } else if (riskPercentage <= 70) {
    // Midlife Crisis Mike: max 30% of bankroll
    return balance * 0.3;
  } else {
    // YOLO Yolanda: max 100% of bankroll
    return balance;
  }
};

/**
 * Calculate the expected value of a bet
 * @param betAmount - The amount being bet
 * @param multiplier - The win multiplier
 * @param probability - Win probability (0-1)
 * @returns Expected value
 */
export const calculateExpectedValue = (
  betAmount: number,
  multiplier: number,
  probability: number
): number => {
  // EV = (probability of winning × amount won) - (probability of losing × amount lost)
  const winAmount = betAmount * (multiplier - 1);
  return (probability * winAmount) - ((1 - probability) * betAmount);
}; 