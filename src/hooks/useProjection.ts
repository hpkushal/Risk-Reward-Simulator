/**
 * Custom hook for generating betting projections
 * 
 * This hook provides functionality to generate projection metrics
 * based on betting history and current balance.
 */

import { useState, useMemo } from 'react';
import type { BetHistory, ProjectionPeriod, ProjectionMetrics } from '../types';
import { 
  calculateUserMetrics, 
  calculateValueAtRisk,
  calculateStandardDeviation,
  calculateBankruptcyRiskScore
} from '../utils/analytics';

/**
 * Hook parameters
 */
interface UseProjectionParams {
  /** Betting history */
  betHistory: BetHistory[];
  /** Current balance */
  balance: number;
  /** Default projection period */
  defaultPeriod?: ProjectionPeriod;
}

/**
 * Hook return value
 */
interface UseProjectionReturn {
  /** Current projection period */
  projectionPeriod: ProjectionPeriod;
  /** Function to set projection period */
  setProjectionPeriod: (period: ProjectionPeriod) => void;
  /** Generated projection metrics */
  projections: ProjectionMetrics | null;
  /** Whether there is enough data to generate projections */
  hasEnoughData: boolean;
}

/**
 * Custom hook that generates betting projections
 * 
 * @param params - Hook parameters
 * @returns Projection data and controls
 */
function useProjection({ 
  betHistory, 
  balance,
  defaultPeriod = '25'
}: UseProjectionParams): UseProjectionReturn {
  const [projectionPeriod, setProjectionPeriod] = useState<ProjectionPeriod>(defaultPeriod);
  
  // Check if we have enough data to generate projections
  const hasEnoughData = betHistory.length >= 5;
  
  // Generate projections when betting history changes
  const projections = useMemo(() => {
    if (!hasEnoughData) return null;
    
    // Get user metrics from betting history
    const metrics = calculateUserMetrics(betHistory);
    const numBets = parseInt(projectionPeriod);
    
    // Prepare for simulation
    const projectedBets = [];
    let projectedBalance = balance;
    let currentWinRate = metrics.winRate;
    let currentBetSize = metrics.avgBetSize;
    let currentRiskLevel = metrics.avgRiskLevel;
    let totalWins = 0;
    let balanceHistory = [projectedBalance];

    // Random variation helper
    const randomVariation = () => (Math.random() * 0.2) - 0.1; // -10% to +10%
    
    // Monte Carlo simulation
    for (let i = 0; i < numBets; i++) {
      // Adjust metrics with trends and random variations
      currentWinRate = Math.max(0.01, Math.min(0.95, 
        currentWinRate + (metrics.winRateTrend / numBets) + randomVariation() * 0.05
      ));
      
      currentBetSize = Math.max(10, 
        currentBetSize * (1 + (metrics.betSizeTrend / numBets) + randomVariation() * 0.1)
      );
      
      currentRiskLevel = Math.max(5, Math.min(95, 
        currentRiskLevel + (metrics.riskTrend / numBets) + randomVariation()
      ));
      
      // Determine bet outcome
      const isWin = Math.random() < currentWinRate;
      if (isWin) totalWins++;
      
      // Calculate average return based on risk level
      const avgReturn = 1 + (currentRiskLevel / 100);
      
      // Update projected balance
      if (isWin) {
        projectedBalance += currentBetSize * avgReturn * 0.8; // 80% of theoretical return
      } else {
        projectedBalance -= currentBetSize;
      }
      
      // Don't allow balance to go below 0
      projectedBalance = Math.max(0, projectedBalance);
      balanceHistory.push(projectedBalance);
      
      projectedBets.push({
        betNumber: i + 1,
        outcome: isWin ? 'win' : 'loss',
        balance: projectedBalance,
        betSize: currentBetSize,
        riskLevel: currentRiskLevel
      });
    }
    
    // Calculate statistics from simulation
    const avgBalance = balanceHistory.reduce((sum, bal) => sum + bal, 0) / balanceHistory.length;
    const balanceStdDev = calculateStandardDeviation(balanceHistory);
    
    // Calculate balance changes for VaR
    const balanceChanges = [];
    for (let i = 1; i < balanceHistory.length; i++) {
      balanceChanges.push(balanceHistory[i] - balanceHistory[i-1]);
    }
    
    // Calculate Value at Risk (95% confidence)
    const valueAtRisk = calculateValueAtRisk(balanceChanges);
    
    // Calculate minimum projected balance
    const minBalance = Math.min(...balanceHistory);
    const maxBalance = Math.max(...balanceHistory);
    
    // Calculate bankruptcy risk score
    const riskAssessment = calculateBankruptcyRiskScore(
      projectedBalance,
      minBalance,
      balance,
      balanceStdDev / avgBalance, // Balance volatility
      valueAtRisk,
      avgBalance,
      metrics.betSizeStdDev
    );
    
    // Return projection metrics
    return {
      finalBalance: projectedBalance,
      projectedWinRate: totalWins / numBets,
      maxBalance,
      minBalance,
      averageBetSize: projectedBets.reduce((sum, bet) => sum + bet.betSize, 0) / numBets,
      averageRiskLevel: projectedBets.reduce((sum, bet) => sum + bet.riskLevel, 0) / numBets,
      bankruptcyRiskScore: riskAssessment.riskScore,
      bankruptcyRiskCategory: riskAssessment.riskCategory,
      balanceVolatility: balanceStdDev / avgBalance,
      valueAtRisk,
      profitPotential: projectedBalance > balance * 1.5 ? 'High' : 
                       projectedBalance > balance * 1.1 ? 'Medium' : 'Low' as 'High' | 'Medium' | 'Low',
      riskBreakdown: riskAssessment.breakdown
    };
  }, [betHistory, balance, projectionPeriod, hasEnoughData]);
  
  return {
    projectionPeriod,
    setProjectionPeriod,
    projections,
    hasEnoughData
  };
}

export default useProjection; 