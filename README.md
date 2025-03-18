# Virtual Bet Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A browser-based gambling simulation platform that provides a risk-free environment for experiencing betting mechanics without real money. The simulator starts users with $1,000 in virtual currency and challenges them to reach $10,000 while avoiding bankruptcy.

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [How It Works](#how-it-works)
  - [Gameplay Loop](#gameplay-loop)
  - [Risk Calculation](#risk-calculation)
  - [Personas](#personas)
  - [Betting Events](#betting-events)
- [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## ✨ Features

- **Risk Management System** - Dynamic risk meter (0-100%) with visual indicators
- **Persona-based Gameplay** - Character profiles that adapt to your risk level:
  - Baby Betsy (0-30% Risk): Safe bets, max 10% bankroll
  - Midlife Crisis Mike (31-70% Risk): Moderate risk, max 30% bankroll
  - YOLO Yolanda (71-100% Risk): High risk, often all-in
- **Diverse Betting Events**:
  - Coin Flip: 2.0x, 50% win chance
  - Dice Roll: 6.0x, ~16.6% win chance
  - Bullseye: 3.0x, 33% win chance
  - Roulette: 35.0x, ~2.7% win chance
  - Stock Market: 10.0x, 10% win chance
  - Lottery: 1000.0x, 0.1% win chance
- **Responsive Design** - Optimized for desktop and mobile devices
- **Theme Support** - Light and dark mode options
- **Results History** - Comprehensive tracking of your betting activities
- **Humorous Feedback** - Witty comments that react to your betting outcomes

## 🖼️ Screenshots

*Insert screenshots here*

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+) or yarn (v1.22+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/virtual-bet-simulator.git
   cd virtual-bet-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:
```bash
npm start
# or
yarn start
```

The application will open automatically at `http://localhost:3000`.

### Building for Production

Generate a production-ready build:
```bash
npm run build
# or
yarn build
```

The compiled assets will be available in the `build` directory.

## 🎮 How It Works

### Gameplay Loop

1. Start with $1,000 in virtual currency
2. Choose a betting event
3. Enter a bet amount or use the quick bet buttons
4. Place your bet and watch the outcome
5. Track your progress toward the $10,000 goal
6. Adapt your strategy based on your risk level
7. Try to avoid bankruptcy!

### Risk Calculation

Risk percentage is calculated using a weighted formula considering:

```
Risk % = (Bet Size Factor × 50) +
         (Event Probability Factor × 30) +
         (Loss Impact Factor × 20)
```

Where:
- Bet Size Factor = Bet Amount / Current Balance
- Event Probability Factor = 1 - Event Win Probability
- Loss Impact Factor = Potential Loss / Current Balance

### Personas

Your risk level determines which persona you embody:

| Persona | Risk Range | Strategy | Max Bet |
|---------|------------|----------|---------|
| Baby Betsy | 0-30% | Conservative | 10% of balance |
| Midlife Crisis Mike | 31-70% | Balanced | 30% of balance |
| YOLO Yolanda | 71-100% | Aggressive | 100% of balance |

### Betting Events

| Event | Multiplier | Win Chance | Risk Level | Min Bet |
|-------|------------|------------|------------|---------|
| Coin Flip | 2.0x | 50% | Low | $10 |
| Dice Roll | 6.0x | 16.6% | Medium | $50 |
| Bullseye | 3.0x | 33% | Low | $30 |
| Roulette | 35.0x | 2.7% | High | $100 |
| Stock Market | 10.0x | 10% | Medium | $200 |
| Lottery | 1000.0x | 0.1% | High | $1 |

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tools**: Create React App

### Project Structure

```
virtual-bet-simulator/
├── public/               # Static assets
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── pages/            # Page components
│   └── utils/            # Utility functions
├── docs/                 # Documentation
└── README.md             # Project overview
```

## 📚 Documentation

For more detailed information, see the [documentation](docs/):

- [Developer Guide](docs/developers/README.md) - Setup, architecture, and code guidelines
- [Product Specifications](docs/product/README.md) - Features, requirements, and roadmap
- [Changelog](docs/CHANGELOG.md) - Version history and updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is designed for educational and entertainment purposes only. It does not involve real money and is not intended to promote gambling activities. The simulator provides a safe environment to understand risk management and probability without financial consequences.
