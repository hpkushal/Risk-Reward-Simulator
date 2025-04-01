/**
 * Utility functions for analytics and risk assessment
 * 
 * This file contains helper functions used in generating and analyzing
 * betting projections, risk calculations, and other analytics features.
 */

import type { BetHistory, RiskLevel, ProjectionMetrics } from '../types';

/**
 * Calculates Value at Risk (VaR) from a set of balance changes
 * 
 * @param balanceChanges - Array of balance changes
 * @param confidenceLevel - Confidence level (0-1), defaults to 0.95 (95%)
 * @returns Value at Risk amount
 */
export const calculateValueAtRisk = (
  balanceChanges: number[],
  confidenceLevel: number = 0.95
): number => {
  if (balanceChanges.length === 0) return 0;
  
  // Sort balance changes in ascending order
  const sortedChanges = [...balanceChanges].sort((a, b) => a - b);
  
  // Find the percentile based on confidence level
  const index = Math.floor(sortedChanges.length * (1 - confidenceLevel));
  
  // Return the absolute value (VaR is typically expressed as a positive number)
  return Math.abs(sortedChanges[Math.max(0, index)]);
};

/**
 * Calculates standard deviation
 * 
 * @param values - Array of numeric values
 * @returns Standard deviation
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length <= 1) return 0;
  
  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate sum of squared differences
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, val) => sum + val, 0);
  
  // Calculate variance and standard deviation
  const variance = sumSquaredDiffs / values.length;
  return Math.sqrt(variance);
};

/**
 * Maps a risk score to a risk category
 * 
 * @param riskScore - Risk score (0-100)
 * @returns Risk level category
 */
export const mapRiskScoreToCategory = (riskScore: number): RiskLevel => {
  if (riskScore < 20) return 'Very Low';
  if (riskScore < 40) return 'Low';
  if (riskScore < 60) return 'Medium';
  if (riskScore < 80) return 'High';
  return 'Very High';
};

/**
 * Calculate key metrics from betting history
 * 
 * @param betHistory - Array of historical bets
 * @returns Object with calculated metrics
 */
export const calculateUserMetrics = (betHistory: BetHistory[]) => {
  if (betHistory.length === 0) {
    return {
      winRate: 0,
      avgBetSize: 0,
      avgRiskLevel: 0,
      winRateTrend: 0,
      betSizeTrend: 0,
      riskTrend: 0,
      recentWinRate: 0,
      bettingFrequency: 0,
      avgBetSizeRatio: 0,
      betSizeStdDev: 0
    };
  }
  
  // Win rate
  const wins = betHistory.filter(bet => bet.outcome === 'win').length;
  const winRate = wins / betHistory.length;
  
  // Average bet size
  const avgBetSize = betHistory.reduce((sum, bet) => sum + bet.betAmount, 0) / betHistory.length;
  
  // Average risk level
  const avgRiskLevel = betHistory.reduce((sum, bet) => sum + bet.riskPercentage, 0) / betHistory.length;
  
  // Recent trends (last 5 bets or fewer if not available)
  const recentBets = [...betHistory]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, Math.min(5, betHistory.length));
  
  const recentWinRate = recentBets.filter(bet => bet.outcome === 'win').length / recentBets.length;
  const recentAvgBetSize = recentBets.reduce((sum, bet) => sum + bet.betAmount, 0) / recentBets.length;
  const recentRiskLevel = recentBets.reduce((sum, bet) => sum + bet.riskPercentage, 0) / recentBets.length;
  
  // Trend factors
  const winRateTrend = (recentWinRate - winRate) * 0.5; // 50% weight
  const betSizeTrend = avgBetSize > 0 ? ((recentAvgBetSize - avgBetSize) / avgBetSize) * 0.3 : 0; // 30% weight
  const riskTrend = avgRiskLevel > 0 ? ((recentRiskLevel - avgRiskLevel) / avgRiskLevel) * 0.2 : 0; // 20% weight
  
  // Betting frequency (average days between bets)
  let bettingFrequency = 0;
  if (betHistory.length > 1) {
    const sortedBets = [...betHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const timeGaps = [];
    for (let i = 1; i < sortedBets.length; i++) {
      const gap = (new Date(sortedBets[i].timestamp).getTime() - new Date(sortedBets[i-1].timestamp).getTime()) / (1000 * 60 * 60 * 24); // in days
      timeGaps.push(gap);
    }
    
    bettingFrequency = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
  }
  
  // Bet sizing strategy (standard deviation of bet size relative to balance)
  const betSizeRatios = betHistory.map(bet => bet.betAmount / bet.balanceAfter);
  const avgBetSizeRatio = betSizeRatios.reduce((sum, ratio) => sum + ratio, 0) / betSizeRatios.length;
  const betSizeStdDev = calculateStandardDeviation(betSizeRatios);
  
  return {
    winRate,
    avgBetSize,
    avgRiskLevel,
    winRateTrend,
    betSizeTrend,
    riskTrend,
    recentWinRate,
    bettingFrequency,
    avgBetSizeRatio,
    betSizeStdDev
  };
};

/**
 * Calculate a bankruptcy risk score based on projection metrics
 * 
 * @param finalBalance - Final projected balance
 * @param minBalance - Minimum projected balance
 * @param initialBalance - Starting balance
 * @param balanceVolatility - Balance volatility (standard deviation / average)
 * @param valueAtRisk - Value at Risk
 * @param avgBalance - Average balance during projection
 * @param betSizeStdDev - Standard deviation of bet size ratios
 * @returns Risk score (0-100) and breakdown of contributing factors
 */
export const calculateBankruptcyRiskScore = (
  finalBalance: number,
  minBalance: number,
  initialBalance: number,
  balanceVolatility: number,
  valueAtRisk: number,
  avgBalance: number,
  betSizeStdDev: number
) => {
  // 1. Final balance ratio (30%)
  const finalBalanceRatio = initialBalance > 0 ? finalBalance / initialBalance : 0;
  const finalBalanceScore = Math.max(0, Math.min(30, 30 * (1 - finalBalanceRatio)));
  
  // 2. Minimum balance ratio (25%)
  const minBalanceRatio = initialBalance > 0 ? minBalance / initialBalance : 0;
  const minBalanceScore = Math.max(0, Math.min(25, 25 * (1 - minBalanceRatio)));
  
  // 3. Volatility score (20%)
  const volatilityScore = Math.min(20, 20 * balanceVolatility);
  
  // 4. VaR score (15%)
  const varRatio = avgBalance > 0 ? valueAtRisk / avgBalance : 0;
  const varScore = Math.min(15, 15 * varRatio);
  
  // 5. Bet sizing strategy (10%)
  // Higher std dev in bet sizing indicates more erratic betting (higher risk)
  const betSizingScore = Math.min(10, 10 * betSizeStdDev * 5);
  
  // Calculate total risk score (0-100)
  const riskScore = finalBalanceScore + minBalanceScore + volatilityScore + varScore + betSizingScore;
  
  return {
    riskScore,
    riskCategory: mapRiskScoreToCategory(riskScore),
    breakdown: {
      finalBalanceContribution: finalBalanceScore,
      minBalanceContribution: minBalanceScore,
      volatilityContribution: volatilityScore,
      varContribution: varScore,
      betSizingContribution: betSizingScore
    }
  };
}; 