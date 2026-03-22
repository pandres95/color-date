import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ChallengeData {
  gridSize: number;
  city: 'Bogota' | 'Toulouse';
  targetColour: { name: string; hex: string };
}

export function MainMenu() {
  const navigate = useNavigate();
  const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('colorDate_challenge');
    if (saved) {
      try {
        setActiveChallenge(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse challenge data', e);
      }
    }
  }, []);

  const handleNewChallenge = () => {
    localStorage.removeItem('colorDate_challenge');
    navigate('/setup');
  };

  const handleContinue = () => {
    // Redirects to setup, but triggers step 4 (Instructions) by loading state
    navigate('/setup?resume=true');
  };

  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto py-8 px-4 text-white overflow-hidden items-center justify-center">
      
      <div className="mb-12 text-center animate-fade-in">
        <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-brand to-rose-500 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(255,87,51,0.5)] flex items-center justify-center text-4xl mb-6 border border-white/20">
          ✨
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
          Colour Date
        </h1>
        <p className="text-zinc-500 font-medium mt-2">The asynchronous photo challenge</p>
      </div>

      <div className="w-full space-y-4 relative z-10 animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
        
        {activeChallenge && (
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand/5"></div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-1 block">Active Challenge</span>
              <h3 className="text-xl font-extrabold text-white">{activeChallenge.targetColour.name}</h3>
              <p className="text-zinc-400 text-sm mt-1">{activeChallenge.gridSize * activeChallenge.gridSize} Photos in {activeChallenge.city}</p>
              
              <button 
                onClick={handleContinue}
                className="w-full py-4 mt-6 bg-brand text-white font-black text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-all"
              >
                Continue Date
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={handleNewChallenge}
          className={`w-full py-4.5 bg-zinc-800 text-white font-bold text-lg rounded-2xl border border-zinc-700 hover:bg-zinc-700 active:scale-[0.98] transition-all ${!activeChallenge ? 'bg-white text-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]' : ''}`}
        >
          {activeChallenge ? 'Descart / New Challenge' : 'Start New Challenge'}
        </button>

      </div>
    </div>
  );
}
