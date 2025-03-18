import React, { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Virtual Bet Simulator</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <div>
        {children}
      </div>
      
      <footer className={`py-4 px-6 mt-12 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-md'} text-sm`}>
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Virtual Bet Simulator. This is a simulation - no real money involved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 