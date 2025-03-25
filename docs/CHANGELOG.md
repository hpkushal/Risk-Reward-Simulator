# Changelog

All notable changes to the Virtual Bet Simulator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2024-03-25

### Added
- Unified Insights page combining Analytics and Journey features
- Dynamic narrative content based on betting history
- Smooth transitions between story and analytics views
- Enhanced user experience with progressive disclosure of information

### Changed
- Merged Analytics and Journey pages into a single Insights page
- Updated navigation to reflect new unified structure
- Improved component organization and code reusability
- Fixed TypeScript linter warnings across analytics components
- Removed unused imports and variables
- Enhanced type safety in analytics components

### Fixed
- Unused variable warnings in analytics components
- Type definition issues in BetForm component
- Import optimization across the application

## [1.2.1] - 2024-03-25

### Changed
- Migrated repository from GitHub to Bitbucket
- Updated documentation to reflect new repository location
- Updated installation and contribution guidelines

## [1.2.0] - 2024-03-24

### Added
- Analytics page with comprehensive betting analysis
- Pattern Recognition component to detect problematic betting patterns
- Predictive Analytics component for forecasting betting outcomes
- Comparative Analytics for benchmarking against responsible gambling standards
- Goal Setting component for responsible gambling targets
- Guided Tour for analytics features
- New utility modules in `src/utils/`:
  - `formatter.ts` for consistent value formatting
  - `validation.ts` for form field validation
  - `betting.ts` for betting calculations
  - `constants.ts` for application-wide constants

### Changed
- Restructured project folders for better organization:
  - Components organized into logical categories (analytics, betting, common, layout, ui)
  - Utilities extracted into dedicated files
  - Improved code reusability through shared components
- Enhanced TypeScript type safety with proper interfaces and type annotations
- Updated documentation to reflect new architecture and features
- Improved dark mode support across all components

### Fixed
- TypeScript implicit 'any' type errors in various components
- Import path issues after folder restructuring
- Styling inconsistencies between light and dark themes

## [1.1.0] - 2024-03-18

### Added
- Initial GitHub repository setup at https://github.com/hpkushal/Risk-Reward-Simulator.git
- Complete project structure with React components and TypeScript
- Comprehensive documentation including developer guide and product specifications

### Changed
- Updated project dependencies to latest versions
- Enhanced documentation with detailed component descriptions
- Improved code organization and structure

## [1.0.0] - 2024-03-18

### Added
- Initial release of the Virtual Bet Simulator
- Risk management system with dynamic risk meter (0-100%)
- Three distinct personas based on risk level (Baby Betsy, Midlife Crisis Mike, YOLO Yolanda)
- Six betting events (Coin Flip, Dice Roll, Bullseye, Roulette, Stock Market, Lottery)
- Responsive UI design for desktop and mobile devices
- Light and dark theme support
- Bet history tracking with outcome visualization
- Progress tracking toward $10,000 goal
- Witty comments for win/loss outcomes

### Technical
- Built with React and TypeScript
- Tailwind CSS for styling
- Context API for state management
- Custom hooks for theme, sound, and game logic

## [0.3.0] - 2024-03-10

### Added
- Bet history component with win/loss tracking
- Progress bar for goal visualization
- Quick bet buttons for common amounts
- Risk visualization in the UI

### Changed
- Improved betting form UX
- Enhanced mobile responsiveness
- Refined risk calculation algorithm

## [0.2.0] - 2024-03-01

### Added
- Light and dark theme support
- Basic layout and component structure
- Persona system with traits and descriptions
- Initial implementation of bet events

### Changed
- Switched to Tailwind CSS from plain CSS
- Updated color scheme for better contrast

## [0.1.0] - 2024-02-15

### Added
- Project initialization
- Basic React setup with TypeScript
- Initial UI design concepts
- Core betting mechanics prototype 