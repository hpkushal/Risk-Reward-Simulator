# Risk-Reward Simulator Architecture

This document outlines the architecture and key technical decisions made in the Risk-Reward Simulator project.

## Overview

The Risk-Reward Simulator is built as a React single-page application (SPA) using TypeScript for type safety and Tailwind CSS for styling. The application simulates betting experiences without real money, providing users with a risk-free environment to understand betting mechanics, risk management, and probability concepts.

## Technical Stack

- **Frontend Framework**: React 19
- **Type System**: TypeScript 4.9
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 7.4
- **Animations**: Framer Motion 12.5
- **Sound Effects**: Howler.js & use-sound
- **Visual Effects**: canvas-confetti

## Architecture

### Component Structure

The application follows a component-based architecture with clear separation of concerns:

```
src/
├── components/              # React components
│   ├── analytics/           # Analytics visualization components
│   ├── betting/             # Betting interface components
│   ├── common/              # Shared/reusable components
│   ├── layout/              # Layout components (header, footer, etc.)
│   └── ui/                  # UI components (buttons, inputs, etc.)
├── context/                 # React context providers
├── hooks/                   # Custom React hooks
├── pages/                   # Page components
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions
```

### State Management

State management is handled entirely through React Context API, avoiding the need for additional state management libraries. The main contexts are:

- **GameContext**: Manages game state, balance, bet history, and game mechanics
- **ThemeContext**: Manages light/dark theme preferences
- **SoundContext**: Manages sound effects and audio settings
- **ToastContext**: Manages toast notifications for game events

### Data Flow

1. User actions (e.g., placing a bet) trigger functions provided by the appropriate context
2. Context providers update their internal state
3. Components that consume the context receive the updated state
4. Components re-render with the new state

This unidirectional data flow ensures predictable state changes and makes debugging easier.

## Key Components

### Game Context

The `GameContext` is the core of the application, managing:

- Current balance
- Bet history
- Risk level
- Game state (playing, won, lost)
- Betting mechanics

It provides functions for:
- Placing bets
- Calculating risk
- Resetting the game

### Analytics Components

The analytics components in `src/components/analytics/` provide sophisticated data visualization and risk analysis:

- **PredictiveAnalytics**: Uses Monte Carlo simulations to project future outcomes
- **BehavioralAnalysis**: Analyzes betting patterns and behavior
- **FinancialMetrics**: Displays financial performance metrics
- **PatternRecognition**: Identifies patterns in betting behavior
- **ComparativeAnalytics**: Compares user performance to different personas

### Betting Components

The betting interface components in `src/components/betting/` manage the user interaction for placing bets:

- **BetForm**: Handles bet amount input and submission
- **BetEvents**: Displays available betting options
- **RiskMeter**: Visualizes current risk level

## Risk Calculation

Risk is calculated using a weighted formula that considers:

1. **Bet Size Factor (50%)**: How much of the bankroll is being wagered
2. **Event Probability Factor (30%)**: Probability of winning the bet
3. **Loss Impact Factor (20%)**: Impact of losing the bet on the bankroll

```typescript
const calculateRisk = (eventId, betAmount) => {
  const event = betEvents.find((e) => e.id === eventId);
  
  // Bet Size Factor (50%)
  const betSizeFactor = Math.min(betAmount / balance, 1);
  
  // Event Probability Factor (30%)
  const eventProbabilityFactor = 1 - event.winChance;
  
  // Loss Impact Factor (20%)
  const lossImpactFactor = Math.min(betAmount / balance, 1);
  
  // Calculate total risk
  const riskPercentage = (betSizeFactor * 50) + 
                        (eventProbabilityFactor * 30) + 
                        (lossImpactFactor * 20);
  
  return Math.min(Math.round(riskPercentage), 100);
};
```

## Predictive Analytics

The PredictiveAnalytics component uses a sophisticated approach to project future outcomes:

1. **Historical Data Analysis**: Analyzes past betting patterns and outcomes
2. **Monte Carlo Simulation**: Runs multiple simulations with random variations
3. **Risk Assessment**: Calculates bankruptcy risk based on:
   - Final balance ratio (30% weight)
   - Minimum balance ratio (25% weight)
   - Balance volatility (20% weight)
   - Value at Risk (15% weight)
   - Betting strategy consistency (10% weight)

## Performance Considerations

- **Memoization**: React.memo and useMemo are used for expensive calculations
- **Code Splitting**: Components are loaded lazily where appropriate
- **Responsive Design**: Tailwind's responsive classes ensure mobile compatibility

## Testing Strategy

- **Unit Tests**: Jest for testing utility functions and hooks
- **Component Tests**: React Testing Library for component tests
- **End-to-End Tests**: Cypress for critical user flows

## Future Improvements

1. **Server-Side Persistence**: Add ability to save game state to a backend
2. **Multiplayer Mode**: Allow multiple users to compete
3. **Advanced Analytics**: Implement more sophisticated statistical models
4. **Tutorial Mode**: Guided onboarding experience for new users

## Architectural Decisions

### Why React Context over Redux?

We chose React Context for state management because:
- The application state is relatively simple
- Context API provides sufficient performance for our needs
- It reduces bundle size and complexity
- It leverages React's built-in features

### Why Tailwind CSS?

Tailwind CSS was chosen for styling because:
- It provides utility-first approach for rapid UI development
- It ensures consistent design language
- It optimizes CSS bundle size in production
- It makes responsive design straightforward 