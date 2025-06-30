# Stick Hero Game - Next.js

A fun and engaging stick hero game built with Next.js, TypeScript, and modern React patterns.

🚀 [**Play the Live Game**](https://stick-game-zeta.vercel.app/)

![Stick Hero Game Screenshot](./ss.png)

## 🎮 Features

- **Smooth Canvas Animation**: 60fps game loop with optimized rendering
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Scoring**: Perfect hits give double points
- **Statistics Tracking**: Game stats with localStorage persistence
- **Beautiful UI**: Modern design with smooth animations
- **Touch Support**: Full mobile touch controls

## 🏗️ Architecture

This project has been refactored to take full advantage of Next.js features and modern React patterns:

### 📁 Project Structure

```
stick-game-4-30/
├── app/
│   ├── page.tsx           # Main game page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── GameCanvas.tsx     # Main game canvas
│   ├── GameTopBar.tsx     # Score display
│   ├── GameControls.tsx   # Control buttons
│   ├── GameOverlays.tsx   # Game overlays (intro, perfect, restart)
│   ├── StatsPanel.tsx     # Statistics panel
│   └── index.ts           # Component exports
├── hooks/                 # Custom React hooks
│   ├── useGameStats.ts    # Statistics management
│   ├── useGameLogic.ts    # Core game logic
│   ├── useGameAnimation.ts # Animation loop
│   └── index.ts           # Hook exports
├── types/                 # TypeScript type definitions
│   └── game.ts            # Game-related interfaces
├── constants/             # Configuration constants
│   └── gameConfig.ts      # Game configuration
├── utils/                 # Utility functions
│   ├── gameUtils.ts       # Game helper functions
│   └── drawingUtils.ts    # Canvas drawing utilities
└── public/                # Static assets
```

### 🔧 Key Improvements

#### **1. Component Separation**

- **GameCanvas**: Handles all canvas rendering with forwardRef for external draw calls
- **GameTopBar**: Displays current score and high score
- **GameControls**: Houses control buttons (statistics, etc.)
- **GameOverlays**: Manages intro screen, perfect score notifications, and restart button
- **StatsPanel**: Comprehensive statistics display with modern UI

#### **2. Custom Hooks**

- **useGameStats**: Manages game statistics with localStorage persistence
- **useGameLogic**: Core game state management and logic
- **useGameAnimation**: Handles the game animation loop and state transitions

#### **3. Type Safety**

- Complete TypeScript coverage with proper interfaces
- Centralized type definitions in `types/game.ts`
- Proper type exports and imports throughout

#### **4. Configuration Management**

- Centralized game configuration in `constants/gameConfig.ts`
- Separate color schemes and generation parameters
- Easy to modify game behavior and appearance

#### **5. Utility Functions**

- Reusable game utilities in `utils/gameUtils.ts`
- Comprehensive drawing utilities in `utils/drawingUtils.ts`
- Proper separation of concerns

#### **6. Next.js Features**

- Optimized font loading with `next/font/google`
- Proper metadata configuration
- Client-side rendering with `"use client"` directive
- Modern Next.js 13+ app directory structure

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd stick-game-4-30
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Play

1. **Start**: Hold down the mouse/touch to stretch out a stick
2. **Release**: Let go to drop the stick and walk across
3. **Perfect Hits**: Land in the red center area for double points
4. **Scoring**: Regular hits = 1 point, Perfect hits = 2 points
5. **Goal**: Achieve the highest score possible!

## 🔧 Development

### Key Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Organization

- **Components**: Reusable UI components with props interfaces
- **Hooks**: Custom hooks for state management and side effects
- **Types**: Centralized TypeScript type definitions
- **Utils**: Pure functions for game logic and canvas operations
- **Constants**: Configuration values and game parameters

### Performance Optimizations

- `useCallback` and `useMemo` for expensive operations
- Proper dependency arrays in useEffect
- Canvas rendering optimizations
- Efficient animation loops with requestAnimationFrame

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+
- Mobile browsers with touch support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Add types for any new functionality
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Acknowledgments

- Built with Next.js and React
- Canvas-based game rendering
- Modern TypeScript patterns
- Responsive design principles
