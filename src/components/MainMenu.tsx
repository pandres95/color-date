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
    <main className="min-[100dvh] flex flex-col bg-background text-on-background animate-fade-in">
      <section className="flex-1 flex flex-col justify-between p-8 md:p-20">
        
        <div className="mt-12 md:mt-16 max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight italic">
            Capture your city’s hues, together.
          </h1>
          {activeChallenge && (
            <div className="mt-8 border-l-2 border-outline-variant/30 pl-4 py-1 animate-fade-in">
              <span className="font-label text-xs tracking-[0.2em] uppercase text-outline-variant block mb-2">Current Mission</span>
              <p className="font-headline text-2xl mb-1">{activeChallenge.targetColour?.name}</p>
              <p className="font-body text-sm text-on-surface-variant flex items-center gap-2">
                <span>{activeChallenge.city}</span>
                <span className="text-outline-variant">•</span>
                <span>{activeChallenge.gridSize * activeChallenge.gridSize} Photos</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8">
          {activeChallenge ? (
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                type="button"
                onClick={handleContinue}
                className="flex-1 px-12 py-6 bg-primary text-on-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 active:scale-95 transition-all duration-300 shadow-none border-0"
              >
                OPEN CHALLENGE
              </button>
              <button 
                type="button"
                onClick={handleNewChallenge}
                className="flex-1 px-12 py-6 border border-primary text-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-surface-container-low active:scale-95 transition-all duration-300 bg-transparent"
              >
                NEW CHALLENGE
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={handleNewChallenge}
              className="w-full md:w-auto px-12 py-6 bg-primary text-on-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 active:scale-95 transition-all duration-300 shadow-none border-0"
            >
              START CHALLENGE
            </button>
          )}
        </div>

      </section>
    </main>
  );
}
