# Developer Guide

This guide provides information for developers working on the Virtual Bet Simulator project.

Version: 1.2.0 (Latest)

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Code Structure](#code-structure)
- [Key Components](#key-components)
- [Context Providers](#context-providers)
- [Utility Functions](#utility-functions)
- [Styling Guidelines](#styling-guidelines)
- [Testing](#testing)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+) or yarn (v1.22+)
- Git

### Development Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/hpkushal/Risk-Reward-Simulator.git
   cd Risk-Reward-Simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run tests:
   ```bash
   npm test
   # or
   yarn test
   ```

## Project Architecture

The Virtual Bet Simulator uses a modern React architecture with the following key technologies:

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Context API**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Jest**: Testing framework

### Architectural Patterns

The application follows these architectural patterns:

1. **Component-based architecture**: UI is broken down into reusable components
2. **Context providers**: For state management and theming
3. **Custom hooks**: For encapsulating and reusing logic
4. **Atomic design principles**: For component organization
5. **Utility-first CSS**: Using Tailwind for styling

## Code Structure

```
virtual-bet-simulator/
├── public/               # Static assets
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   │   ├── analytics/    # Analytics-related components
│   │   │   ├── BehavioralAnalysis.tsx # User behavior analysis
│   │   │   ├── BettingPatterns.tsx    # Pattern identification
│   │   │   ├── ComparativeAnalytics.tsx # Benchmarking
│   │   │   ├── FinancialMetrics.tsx   # Financial analysis
│   │   │   ├── GoalSetting.tsx        # Responsible gambling goals
│   │   │   ├── GuidedTour.tsx         # Interactive tour
│   │   │   ├── PatternRecognition.tsx # Problematic pattern detection
│   │   │   └── PredictiveAnalytics.tsx # Future projections
│   │   ├── betting/      # Betting-related components
│   │   │   ├── BetCard.tsx            # Betting option display
│   │   │   ├── BetForm.tsx            # Betting form
│   │   │   ├── BetHistory.tsx         # History of bets
│   │   │   └── BetOptions.tsx         # Available betting options
│   │   ├── common/       # Common/shared components
│   │   │   └── PersonaCard.tsx        # User persona display
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx             # Application header
│   │   │   └── Layout.tsx             # Page layout wrapper
│   │   └── ui/           # UI primitive components
│   │       ├── ProgressBar.tsx        # Goal progress
│   │       ├── ResetButton.tsx        # Game reset
│   │       ├── RiskMeter.tsx          # Risk visualization
│   │       └── Tooltip.tsx            # Interactive tooltips
│   ├── context/          # React Context providers
│   │   ├── GameContext.tsx            # Game state and logic
│   │   ├── SoundContext.tsx           # Sound effects
│   │   ├── ThemeContext.tsx           # Light/dark theme
│   │   └── ToastContext.tsx           # Notifications
│   ├── pages/            # Page components
│   │   ├── Analytics.tsx              # Analytics dashboard
│   │   └── Dashboard.tsx              # Main game screen
│   ├── utils/            # Utility functions
│   │   ├── betting.ts                 # Betting calculations
│   │   ├── constants.ts               # Application constants
│   │   ├── formatter.ts               # Value formatting
│   │   ├── index.ts                   # Central export point
│   │   └── validation.ts              # Form validation
│   ├── App.tsx           # Main App component
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project overview
```

## Key Components

### Dashboard Page Components

#### `BetForm`

The BetForm component handles user input for placing bets. It includes:

- Amount input field
- Quick bet buttons
- Risk level visualization
- Bet submission logic

```tsx
// BetForm.tsx
// Handles user input for bet amount and submission
interface BetFormProps {
  selectedEventId?: string;
}

const BetForm: React.FC<BetFormProps> = ({ selectedEventId }) => {
  // Implementation details...
}
```

#### `BetOptions`

The BetOptions component displays the available betting events and allows users to select one.

```tsx
// BetOptions.tsx
// Displays available betting options
interface BetOptionsProps {
  onSelectEvent: (eventId: string) => void;
}

const BetOptions: React.FC<BetOptionsProps> = ({ onSelectEvent }) => {
  // Implementation details...
}
```

#### `PersonaCard`

The PersonaCard displays the current user persona based on risk level.

```tsx
// PersonaCard.tsx
// Displays user persona information
const PersonaCard: React.FC = () => {
  // Implementation details...
}
```

#### `BetHistory`

The BetHistory component shows a record of past bets and their outcomes.

```tsx
// BetHistory.tsx
// Displays history of bets
const BetHistory: React.FC = () => {
  // Implementation details...
}
```

### Analytics Page Components

#### `PatternRecognition`

The PatternRecognition component analyzes betting history to identify potentially harmful gambling patterns.

```tsx
// PatternRecognition.tsx
// Analyzes betting patterns for problematic behavior
interface PatternWarning {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

const PatternRecognition: React.FC = () => {
  // Implementation details...
}
```

#### `PredictiveAnalytics`

The PredictiveAnalytics component forecasts future betting outcomes based on current patterns.

```tsx
// PredictiveAnalytics.tsx
// Projects future betting outcomes
const PredictiveAnalytics: React.FC = () => {
  // Implementation details...
}
```

#### `GoalSetting`

The GoalSetting component allows users to set responsible gambling goals.

```tsx
// GoalSetting.tsx
// Manages responsible gambling goals
interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'minutes' | 'count';
  defaultValue: number;
  currentValue: number;
  isCompleted: boolean;
  isActive: boolean;
}

const GoalSetting: React.FC = () => {
  // Implementation details...
}
```

## Context Providers

### `GameContext`

The GameContext provides global game state and logic:

```tsx
// GameContext.tsx
interface GameContextType {
  balance: number;
  currentRisk: number;
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

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Implementation details...
}
```

### `ThemeContext`

The ThemeContext handles light and dark mode:

```tsx
// ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Implementation details...
}
```

## Utility Functions

The application includes several utility modules for common operations:

### `formatter.ts`

Provides consistent formatting for values across the application:

```tsx
// formatter.ts
export const formatCurrency = (value: number, currency: string = '$', decimals: number = 2): string => {
  return `${currency}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPercentage = (value: number, decimals: number = 1, includeSymbol: boolean = true): string => {
  const formatted = (value * 100).toFixed(decimals);
  return includeSymbol ? `${formatted}%` : formatted;
};

export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  // Implementation details...
};

export const truncateString = (str: string, maxLength: number): string => {
  // Implementation details...
};
```

### `betting.ts`

Contains betting-related calculations:

```tsx
// betting.ts
export const calculateRiskPercentage = (
  betAmount: number,
  balance: number,
  eventProbability: number
): number => {
  // Implementation details...
};

export const determinePersona = (riskPercentage: number): string => {
  // Implementation details...
};

export const calculateMaxBet = (balance: number, riskPercentage: number): number => {
  // Implementation details...
};

export const calculateExpectedValue = (
  betAmount: number,
  multiplier: number,
  probability: number
): number => {
  // Implementation details...
};
```

### `validation.ts`

Provides form validation functions:

```tsx
// validation.ts
export const validateBetAmount = (value: number, balance: number, minBet: number = 1): string => {
  // Implementation details...
};

export const validatePercentage = (value: number): string => {
  // Implementation details...
};

export const validatePositiveNumber = (value: number): string => {
  // Implementation details...
};

export const validateRequired = (value: string): string => {
  // Implementation details...
};
```

### `constants.ts`

Defines application-wide constants:

```tsx
// constants.ts
export const INITIAL_BALANCE = 1000;
export const GOAL_AMOUNT = 10000;
export const BETTING_EVENTS = [...];
export const PERSONA_THRESHOLDS = {...};
export const RISK_LEVELS = {...};
export const STORAGE_KEYS = {...};
```

## Styling Guidelines

The project uses Tailwind CSS for styling. Some key guidelines:

1. Use Tailwind classes for styling whenever possible
2. Follow the color palette defined in `tailwind.config.js`
3. Use dark mode classes with the `isDarkMode ? 'dark-class' : 'light-class'` pattern
4. Use responsive prefixes (`sm:`, `md:`, `lg:`) for responsive design

Example:
```tsx
<div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
  <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Heading</h2>
  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Content</p>
</div>
```

## Testing

The project uses Jest and React Testing Library for testing. Run tests with:

```bash
npm test
# or
yarn test
```

When writing tests, follow these guidelines:

1. Focus on testing user behavior, not implementation details
2. Use the React Testing Library's `screen` and `userEvent` utilities
3. Mock context providers when necessary
4. Keep tests simple and focused on a single behavior

## Contributing

To contribute to the project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request 