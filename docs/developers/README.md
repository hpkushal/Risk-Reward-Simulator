# Developer Guide

This guide provides information for developers working on the Virtual Bet Simulator project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Code Structure](#code-structure)
- [Key Components](#key-components)
- [Context Providers](#context-providers)
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
   git clone https://github.com/yourusername/virtual-bet-simulator.git
   cd virtual-bet-simulator
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

## Code Structure

```
virtual-bet-simulator/
├── public/               # Static assets
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   │   ├── BetCard.tsx   # Betting option display
│   │   ├── BetForm.tsx   # Betting form
│   │   ├── BetHistory.tsx # History of bets
│   │   ├── BetOptions.tsx # Available betting options
│   │   ├── Layout.tsx    # Page layout wrapper
│   │   ├── PersonaCard.tsx # User persona display
│   │   ├── ProgressBar.tsx # Goal progress
│   │   └── ResetButton.tsx # Game reset
│   ├── context/          # React Context providers
│   │   ├── GameContext.tsx # Game state and logic
│   │   ├── SoundContext.tsx # Sound effects
│   │   ├── ThemeContext.tsx # Light/dark theme
│   │   └── ToastContext.tsx # Notifications
│   ├── pages/            # Page components
│   │   └── Dashboard.tsx # Main game screen
│   ├── utils/            # Utility functions
│   │   └── calculations.ts # Math utilities
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

### `BetForm`

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

### `BetOptions`

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

### `PersonaCard`

The PersonaCard displays the current user persona based on risk level.

```tsx
// PersonaCard.tsx
// Displays user persona information
const PersonaCard: React.FC = () => {
  // Implementation details...
}
```

### `BetHistory`

The BetHistory component shows a record of past bets and their outcomes.

```tsx
// BetHistory.tsx
// Displays history of bets
const BetHistory: React.FC = () => {
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

## Styling Guidelines

The project uses Tailwind CSS for styling. Some key guidelines:

1. Use Tailwind classes for styling whenever possible
2. Follow the color palette defined in `tailwind.config.js`
3. Use dark mode classes with the `dark:` prefix for dark theme support
4. Use responsive prefixes (`sm:`, `md:`, `lg:`) for responsive design

Example:
```tsx
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
  <h2 className="text-gray-800 dark:text-white text-lg font-bold mb-2">Title</h2>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
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

Example test:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BetForm from './BetForm';

test('updates bet amount when user types into input', async () => {
  render(<BetForm selectedEventId="coin-flip" />);
  
  const input = screen.getByPlaceholderText('Enter amount');
  await userEvent.type(input, '100');
  
  expect(input).toHaveValue(100);
});
```

## Contributing

To contribute to the project:

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

5. Wait for code review and approval

### Code Style Guidelines

- Use TypeScript for all new components
- Add proper type definitions and interfaces
- Use functional components with hooks
- Document complex logic with comments
- Keep components focused and maintainable
- Follow the existing naming conventions 