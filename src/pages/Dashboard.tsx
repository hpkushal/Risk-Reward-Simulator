import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import Layout from '../components/layout/Layout';
import BetOptions from '../components/betting/BetOptions';
import BetHistory from '../components/betting/BetHistory';
import ProgressBar from '../components/ui/ProgressBar';
import PersonaCard from '../components/common/PersonaCard';
import BetForm from '../components/betting/BetForm';

const Dashboard: React.FC = () => {
  // We need the gameState for future functionality, but it's not used directly in the render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gameState } = useGame();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  
  // Callback for handling event selection from BetOptions
  const handleEventSelection = useCallback((id: string) => {
    setSelectedEventId(id);
  }, []);
  
  return (
    <Layout>
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold mb-1">Risk & Reward Simulator</h1>
          <p className="text-gray-500">Turn $1,000 into $10,000... if you dare! 🎯</p>
        </div>
        
        <ProgressBar />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <PersonaCard />
          </div>
          
          <div className="md:col-span-2">
            <div className="p-4 bg-gray-900 rounded-lg text-white">
              <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>
              <BetForm selectedEventId={selectedEventId} />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <BetOptions onSelectEvent={handleEventSelection} />
        </div>
        
        <div>
          <BetHistory />
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard; 