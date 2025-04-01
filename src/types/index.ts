/**
 * Central type definitions for the Risk Reward Simulator
 * 
 * This file exports all common types used throughout the application.
 * It helps maintain consistency and provides a single source of truth
 * for type definitions.
 * 
 * @module types
 */

import type { BetEvent, BetHistory, Persona, GameState } from '../context/GameContext';

export type { BetEvent, BetHistory, Persona, GameState };

/**
 * Available theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Projection period options
 */
export type ProjectionPeriod = '10' | '25' | '50';

/**
 * Risk level classification
 */
export type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

/**
 * Projection metrics interface
 */
export interface ProjectionMetrics {
  /** Final projected balance */
  finalBalance: number;
  /** Projected win rate (0-1) */
  projectedWinRate: number;
  /** Maximum balance during projection */
  maxBalance: number;
  /** Minimum balance during projection */
  minBalance: number;
  /** Average bet size in projection */
  averageBetSize: number;
  /** Average risk level in projection */
  averageRiskLevel: number;
  /** Bankruptcy risk score (0-100) */
  bankruptcyRiskScore: number;
  /** Bankruptcy risk category */
  bankruptcyRiskCategory: RiskLevel;
  /** Balance volatility (std deviation / avg balance) */
  balanceVolatility: number;
  /** Value at Risk amount */
  valueAtRisk: number;
  /** Potential for profit */
  profitPotential: 'Low' | 'Medium' | 'High';
  /** Breakdown of risk score components */
  riskBreakdown: {
    /** Final balance contribution (0-30) */
    finalBalanceContribution: number;
    /** Minimum balance contribution (0-25) */
    minBalanceContribution: number;
    /** Volatility contribution (0-20) */
    volatilityContribution: number;
    /** Value at Risk contribution (0-15) */
    varContribution: number;
    /** Bet sizing contribution (0-10) */
    betSizingContribution: number;
  };
}

/**
 * User metrics calculated from betting history
 */
export interface UserMetrics {
  /** Win rate (0-1) */
  winRate: number;
  /** Average bet size */
  avgBetSize: number;
  /** Average risk level */
  avgRiskLevel: number;
  /** Trend in win rate */
  winRateTrend: number;
  /** Trend in bet sizing */
  betSizeTrend: number;
  /** Trend in risk level */
  riskTrend: number;
  /** Recent win rate */
  recentWinRate: number;
  /** Average time between bets */
  bettingFrequency: number;
  /** Average bet size as ratio of balance */
  avgBetSizeRatio: number;
  /** Standard deviation of bet size ratios */
  betSizeStdDev: number;
} 