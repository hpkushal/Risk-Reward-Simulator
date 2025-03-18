import React from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { ToastProvider } from './context/ToastContext';
import { GameProvider } from './context/GameContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ToastProvider>
          <GameProvider>
            <Dashboard />
          </GameProvider>
        </ToastProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
