# Risk Reward Simulator

A sophisticated browser-based application that simulates betting experiences without real money, providing users with a risk-free environment to understand betting mechanics, risk management, and probability concepts through an engaging, gamified interface.

## Features

- **Virtual Currency System**: Start with $1,000 virtual currency and aim to reach $10,000
- **Advanced Risk Management System**: Dynamic risk meter with sophisticated risk calculations including Value at Risk (VaR)
- **Persona System**: Different betting personalities with unique strategies
- **Various Betting Events**: Multiple betting events with different risk-reward profiles
- **Comprehensive Analytics Dashboard**: In-depth analytics including predictive projections, pattern recognition, and behavioral analysis

## Live Demo

[View the live demo](https://risk-reward-simulator.vercel.app)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Risk-Reward-Simulator.git
```

2. Navigate to the project directory:
```bash
cd Risk-Reward-Simulator
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

## Technology Stack

- **React 19**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling components
- **React Context API**: For state management
- **React Router**: For routing
- **Framer Motion**: For animations
- **Howler/use-sound**: For sound effects
- **canvas-confetti**: For visual effects

## Project Structure

```
src/
├── components/              # React components
│   ├── analytics/           # Analytics components
│   │   ├── BehavioralAnalysis.tsx
│   │   ├── BettingPatterns.tsx
│   │   ├── ComparativeAnalytics.tsx
│   │   ├── FinancialMetrics.tsx
│   │   ├── PatternRecognition.tsx
│   │   └── PredictiveAnalytics.tsx
│   ├── betting/             # Betting components
│   ├── common/              # Common/shared components
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── context/                 # React context providers
│   ├── GameContext.tsx      # Main game logic and state
│   ├── SoundContext.tsx     # Sound management
│   ├── ThemeContext.tsx     # Theme management
│   └── ToastContext.tsx     # Toast notifications
├── hooks/                   # Custom React hooks
├── pages/                   # Page components
│   ├── Dashboard.tsx        # Main game screen
│   └── Insights.tsx         # Analytics dashboard
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── App.tsx                  # Root component
└── index.tsx                # Entry point
```

## Core Concepts

### Game Mechanics

The Risk Reward Simulator is built around several key concepts:

1. **Risk Management**: Each bet has a calculated risk percentage based on:
   - Bet size relative to balance (50% weight)
   - Event probability (30% weight)
   - Potential loss impact (20% weight)

2. **Persona System**: Risk level determines which betting persona the user embodies:
   - Baby Betsy (0-30% risk): Conservative approach with small bets
   - Midlife Crisis Mike (31-70% risk): Balanced approach with moderate risk
   - YOLO Yolanda (71-100% risk): Aggressive approach with high-risk bets

3. **Predictive Analytics**: Advanced risk assessment using:
   - Monte Carlo simulations for future projections
   - Value at Risk (VaR) calculations
   - Balance volatility analysis
   - Betting pattern recognition

### Technical Implementation

- **Context-based State Management**: All game state managed through React Context
- **Component-based Architecture**: Modular design with clean separation of concerns
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by behavioral finance and risk management concepts
- Educational tool for understanding probability and risk assessment