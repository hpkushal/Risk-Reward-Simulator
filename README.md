# Virtual Bet Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.2.0-green.svg)](https://bitbucket.publishing.tools/projects/SD/repos/risk-reward-simulator/browse)

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
  - [Analytics Features](#analytics-features)
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
- **Comprehensive Analytics Dashboard**:
  - Behavioral Analysis: Understand your betting habits
  - Financial Metrics: Track your performance over time
  - Betting Patterns: Visualize trends in your betting behavior
  - Pattern Recognition: Identify potentially harmful gambling patterns
  - Predictive Analytics: See projections of future outcomes
  - Comparative Analytics: Benchmark against responsible gambling standards
  - Goal Setting: Set and track responsible gambling targets
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
   git clone ssh://git@bitbucket.publishing.tools:7999/sd/risk-reward-simulator.git
   cd risk-reward-simulator
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
8. Analyze your betting patterns and set responsible gambling goals

### Risk Calculation

Risk percentage is calculated using a weighted formula considering:

```