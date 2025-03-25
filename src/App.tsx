import React from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { ToastProvider } from './context/ToastContext';
import { GameProvider } from './context/GameContext';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Insights from './pages/Insights';

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ToastProvider>
          <GameProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/insights" element={<Insights />} />
              </Routes>
            </Router>
          </GameProvider>
        </ToastProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
