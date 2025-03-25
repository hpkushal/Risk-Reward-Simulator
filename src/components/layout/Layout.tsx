import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const location = useLocation();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Virtual Bet Simulator</h1>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md transition ${
                  location.pathname === '/' 
                    ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900' 
                    : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/insights" 
                className={`px-3 py-2 rounded-md transition ${
                  location.pathname === '/insights' 
                    ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900' 
                    : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Insights
              </Link>
            </nav>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
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