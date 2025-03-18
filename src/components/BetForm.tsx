import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

// Funny comments based on outcome and bet type
const funnyComments = {
  win: [
    "Ka-ching! Your wallet just got heavier! 💰",
    "You're on fire! Someone call the money fire department! 🔥",
    "The odds were ever in your favor today!",
    "Winner winner chicken dinner! 🍗",
    "Your lucky underwear is really paying off today!",
    "The gambling gods have blessed you with their favor!",
    "Time to take a screenshot for your financial advisor!",
    "That wasn't luck - that was pure skill! (Or was it? 🤔)",
    "If only your school teachers could see you now!",
    "This is the kind of math we should've learned in school!"
  ],
  loss: [
    "Well, that money just went on vacation... permanently! ✈️",
    "The house always wins, except when it doesn't, which isn't now!",
    "Your money just ghosted you! 👻",
    "That wasn't a loss - it was a donation to the cause of probability!",
    "Money comes, money goes... mostly goes in your case!",
    "Have you considered a career NOT in professional gambling?",
    "That bet was so bad even your imaginary financial advisor quit!",
    "The spirit of bad luck says 'you're welcome'!",
    "At least you still have your charming personality!",
    "If losing was an Olympic sport, you'd have a gold medal right now! 🥇"
  ],
  betType: {
    'coin-flip': [
      "Heads you win, tails you... oh, never mind.",
      "That coin had other plans for your money!",
      "The coin has spoken! And it's kind of sassy today.",
      "If only you could flip your financial decisions as easily!",
      "This coin must be from the Treasury Department of Pain!"
    ],
    'dice-roll': [
      "Those dice have a vendetta against your wallet!",
      "The dice gods demand a sacrifice... of your balance!",
      "Snake eyes? More like snake, why?!",
      "Dice be rollin', your balance be fallin'!",
      "The dice are loaded... with disappointment!"
    ],
    'bullseye': [
      "Bullseye? More like bull-sigh today!",
      "You missed the target but hit your wallet perfectly!",
      "Your aim is almost as bad as your betting strategy!",
      "The target was your money all along!",
      "Dart throwing AND money throwing - you're multitalented!"
    ],
    'roulette': [
      "Round and round the wheel goes, where your money stops, nobody knows!",
      "The ball has betrayed you in spectacular fashion!",
      "That roulette wheel is just a fancy money disposal!",
      "You've been wheelie unlucky today!",
      "At least in Vegas they'd give you a free drink with that loss!"
    ],
    'stock-market': [
      "Buy high, sell low - you're doing great!",
      "Your portfolio is more volatile than a TikTok trend!",
      "Warren Buffett would like a word with you...",
      "The invisible hand of the market just gave you a high five... to the face!",
      "Breaking news: Your stock just crashed harder than a Windows 95 PC!"
    ],
    'lottery': [
      "The odds were only 1 in 14 million. You were so close!",
      "Think of all the losing tickets you saved money on!",
      "Your lucky numbers are clearly taking a day off!",
      "Your fortune cookie lied to you!",
      "Maybe try using your birthday... from another life!"
    ]
  }
};

// Helper function to get a random comment
const getRandomComment = (betType: string, isWin: boolean) => {
  // Get outcome comments
  const outcomeComments = isWin ? funnyComments.win : funnyComments.loss;
  
  // Get bet type specific comments
  const betTypeComments = funnyComments.betType[betType as keyof typeof funnyComments.betType] || [];
  
  // Combine all applicable comments and pick a random one
  const allComments = [...outcomeComments, ...betTypeComments];
  return allComments[Math.floor(Math.random() * allComments.length)];
};

interface BetFormProps {
  selectedEventId?: string;
}

const BetForm: React.FC<BetFormProps> = ({ selectedEventId }) => {
  const { betEvents, balance, placeBet, calculateRisk, isProcessingBet, currentPersona } = useGame();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [selectedEvent, setSelectedEvent] = useState<string>(betEvents[0]?.id || '');
  const [betAmount, setBetAmount] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<number>(0);
  const [betResult, setBetResult] = useState<{success: boolean; message: string; comment?: string} | null>(null);
  
  // Update selected event when prop changes
  useEffect(() => {
    if (selectedEventId && betEvents.some(event => event.id === selectedEventId)) {
      setSelectedEvent(selectedEventId);
    }
  }, [selectedEventId, betEvents]);
  
  // Get the current selected event details
  const currentEvent = betEvents.find(event => event.id === selectedEvent) || betEvents[0];
  
  // Quick bet button values
  const quickBets = [10, 20, 50, 100, 500];
  
  // Update risk when event changes
  useEffect(() => {
    if (betAmount && selectedEvent) {
      const amount = parseFloat(betAmount);
      if (!isNaN(amount)) {
        setRiskLevel(calculateRisk(selectedEvent, amount));
      }
    }
  }, [selectedEvent, betAmount, calculateRisk]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetAmount(value);
    
    const amount = parseFloat(value);
    if (!isNaN(amount) && selectedEvent) {
      setRiskLevel(calculateRisk(selectedEvent, amount));
    } else {
      setRiskLevel(0);
    }
  };
  
  const handleQuickBet = (amount: number) => {
    setBetAmount(amount.toString());
    if (selectedEvent) {
      setRiskLevel(calculateRisk(selectedEvent, amount));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !betAmount) {
      setBetResult({
        success: false,
        message: 'Please select an event and enter a bet amount'
      });
      return;
    }
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setBetResult({
        success: false,
        message: 'Please enter a valid bet amount'
      });
      return;
    }
    
    const event = betEvents.find(e => e.id === selectedEvent);
    if (!event) {
      setBetResult({
        success: false,
        message: 'Invalid event selected'
      });
      return;
    }
    
    if (amount < event.minBet) {
      setBetResult({
        success: false,
        message: `Minimum bet for ${event.name} is $${event.minBet}`
      });
      return;
    }
    
    if (event.maxBet !== null && amount > event.maxBet) {
      setBetResult({
        success: false,
        message: `Maximum bet for ${event.name} is $${event.maxBet}`
      });
      return;
    }
    
    if (amount > balance) {
      setBetResult({
        success: false,
        message: 'Not enough balance'
      });
      return;
    }
    
    const result = placeBet(selectedEvent, amount);
    
    // Generate a funny comment
    const comment = getRandomComment(
      selectedEvent,
      result
    );
    
    setBetResult({
      success: true,
      message: result ? 'You won!' : 'You lost. Try again!',
      comment
    });
    
    // Reset bet amount
    setBetAmount('');
    setRiskLevel(0);
  };
  
  // Get color based on risk level
  const getRiskColor = () => {
    if (riskLevel < 30) return { bg: 'bg-green-500', text: 'text-green-500' };
    if (riskLevel < 70) return { bg: 'bg-yellow-500', text: 'text-yellow-500' };
    return { bg: 'bg-red-500', text: 'text-red-500' };
  };
  
  const riskColor = getRiskColor();
  
  return (
    <div>
      <div className="mb-4">
        <div className="mb-4">
          <h3 className="font-semibold mb-1 text-white">
            Selected: {currentEvent.icon} {currentEvent.name}
          </h3>
          <div className="text-sm text-gray-400 mb-3">
            <div className="flex justify-between">
              <span>Multiplier: {currentEvent.multiplier}x</span>
              <span>Win Chance: {Math.round(currentEvent.winChance * 100)}%</span>
            </div>
            <div>Min Bet: ${currentEvent.minBet}{currentEvent.maxBet !== null ? `, Max: $${currentEvent.maxBet}` : ''}</div>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={betAmount}
            onChange={handleAmountChange}
            className="w-full p-3 pl-6 bg-gray-800 rounded-lg text-white text-lg border border-gray-700 focus:border-primary-500 focus:outline-none"
            min="0"
            step="1"
            placeholder="Enter amount"
            disabled={isProcessingBet}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {quickBets.map(amount => (
          <button
            key={amount}
            type="button"
            onClick={() => handleQuickBet(amount)}
            className={`px-3 py-1 border rounded-full text-sm ${
              betAmount === amount.toString() 
                ? 'bg-primary-600 text-white border-primary-500' 
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
            disabled={isProcessingBet || amount > balance}
          >
            ${amount}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleQuickBet(balance)}
          className={`px-3 py-1 border rounded-full text-sm ${
            betAmount === balance.toString() 
              ? 'bg-red-600 text-white border-red-500' 
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
          disabled={isProcessingBet || balance <= 0}
        >
          ALL-IN
        </button>
      </div>
      
      {riskLevel > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white">Risk Level</span>
            <span className={riskColor.text}>{riskLevel}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${riskColor.bg} transition-all duration-300`} 
              style={{ width: `${riskLevel}%` }}
            />
          </div>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition 
          ${isProcessingBet ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessingBet || !betAmount || parseFloat(betAmount) <= 0}
      >
        {isProcessingBet ? 'Processing...' : 'PLACE BET'}
      </button>
      
      {betResult && (
        <div className="mt-4">
          <div className={`p-3 rounded text-center ${
            betResult.success 
              ? betResult.message.includes('won') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {betResult.message}
          </div>
          
          {betResult.comment && (
            <div className="mt-2 p-3 bg-gray-700 rounded-lg text-gray-200 italic">
              "{betResult.comment}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BetForm; 