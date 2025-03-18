import React, { createContext, useContext, useState, ReactNode } from 'react';

type SoundEffect = 'win' | 'loss' | 'click' | 'bet' | 'bigWin';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (sound: SoundEffect) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Play a sound effect if enabled
  const playSound = (sound: SoundEffect) => {
    // Sound implementation will be added later
    console.log(`Playing sound: ${sound}`);
  };

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use the sound context
export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}; 