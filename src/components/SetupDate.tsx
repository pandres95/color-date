import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateTargetColour } from '../utils/colours';
import type { ChallengeData } from './MainMenu';

type City = 'Bogota' | 'Toulouse';

export function SetupDate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [gridSize, setGridSize] = useState<2 | 3>(2);
  const [city, setCity] = useState<City>('Bogota');
  const [isLocating, setIsLocating] = useState(false);
  const [targetColour, setTargetColour] = useState<{ name: string; hex: string } | null>(null);

  // Resume active challenge if requested
  useEffect(() => {
    if (searchParams.get('resume') === 'true') {
      const saved = localStorage.getItem('colorDate_challenge');
      if (saved) {
        const data: ChallengeData = JSON.parse(saved);
        setGridSize(data.gridSize as 2 | 3);
        setCity(data.city);
        setTargetColour(data.targetColour);
        setStep(4); // Jump straight to instructions
      }
    }
  }, [searchParams]);

  // Auto-locate only when moving to Step 2
  useEffect(() => {
    if (step === 2) {
      setIsLocating(true);
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (pos.coords.longitude < -30) setCity('Bogota');
            else setCity('Toulouse');
            setIsLocating(false);
          },
          () => setIsLocating(false),
          { timeout: 5000, maximumAge: 60000 }
        );
      } else {
        setIsLocating(false);
      }
    }
  }, [step]);

  const handleGenerate = () => {
    const colour = generateTargetColour(city);
    setTargetColour(colour);
  };

  const advanceStep = () => {
    if (step === 3) {
      if (!targetColour) handleGenerate(); // Force generation if they didn't manually
      // Save full sequence to persistence!
      if (targetColour) {
        const data: ChallengeData = { gridSize, city, targetColour };
        localStorage.setItem('colorDate_challenge', JSON.stringify(data));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, 4));
  };

  // When clicking Generate on Step 3, auto-generate and immediately persist? 
  // We'll let them click Generate, see it, then click "Accept Challenge"
  
  const currentThemeColor = targetColour ? targetColour.hex : '#18181b';

  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto py-8 px-4 text-white overflow-y-auto no-scrollbar pb-10">
      
      {/* Stepper Header */}
      <div className="flex flex-col mb-8 mt-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              {step === 1 ? 'Step 1' : step === 2 ? 'Step 2' : step === 3 ? 'Step 3' : 'Mission'}
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              {step === 1 ? 'Layout Size' : step === 2 ? 'Location' : step === 3 ? 'Target Hue' : 'Instructions'}
            </p>
          </div>
          <button onClick={() => navigate('/menu')} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-zinc-400 active:scale-95">
            ✕
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex space-x-2 w-full h-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand' : 'bg-zinc-800'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-fade-in transition-all">
        
        {/* STEP 1: LAYOUT */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 pb-2">Select the grid size</h2>
            <div className="flex space-x-4">
              <button 
                type="button"
                onClick={() => { setGridSize(2); }}
                className={`flex-1 py-8 rounded-3xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${gridSize === 2 ? 'bg-brand/10 border-brand text-brand shadow-[0_0_20px_rgba(255,87,51,0.2)] scale-[1.02]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
              >
                <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-4 opacity-80">
                  <div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div>
                </div>
                <span className="text-3xl font-black mb-1">2x2</span>
                <span className="text-sm font-medium">4 Photos</span>
              </button>
              <button 
                type="button"
                onClick={() => { setGridSize(3); }}
                className={`flex-1 py-8 rounded-3xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${gridSize === 3 ? 'bg-brand/10 border-brand text-brand shadow-[0_0_20px_rgba(255,87,51,0.2)] scale-[1.02]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
              >
                <div className="grid grid-cols-3 gap-1 w-12 h-12 mb-4 opacity-80">
                  {[...Array(9)].map((_, i) => <div key={i} className="bg-current rounded-[1px]"></div>)}
                </div>
                <span className="text-3xl font-black mb-1">3x3</span>
                <span className="text-sm font-medium">9 Photos</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 pb-2">Where are you?</h2>
            {isLocating && <p className="text-brand text-sm animate-pulse">Auto-detecting your hemisphere...</p>}
            
            <div className="flex flex-col space-y-4">
              <button 
                type="button"
                onClick={() => setCity('Bogota')}
                className={`w-full py-6 px-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-300 ${city === 'Bogota' ? 'bg-zinc-800 border-zinc-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
              >
                <div className="flex items-center">
                  <span className="text-4xl mr-4">🇨🇴</span>
                  <span className="text-2xl font-bold">Bogotá</span>
                </div>
                {city === 'Bogota' && <span className="w-4 h-4 bg-white rounded-full"></span>}
              </button>

              <button 
                type="button"
                onClick={() => setCity('Toulouse')}
                className={`w-full py-6 px-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-300 ${city === 'Toulouse' ? 'bg-zinc-800 border-zinc-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
              >
                <div className="flex items-center">
                  <span className="text-4xl mr-4">🇫🇷</span>
                  <span className="text-2xl font-bold">Toulouse</span>
                </div>
                {city === 'Toulouse' && <span className="w-4 h-4 bg-white rounded-full"></span>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TARGET HUE */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 pb-2">Find your hue</h2>
            
            <div 
              className={`w-full aspect-[4/3] rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${targetColour ? 'shadow-2xl scale-[1.02]' : 'border-2 border-dashed border-zinc-800'}`}
              style={{ 
                backgroundColor: currentThemeColor,
                boxShadow: targetColour ? `0 20px 40px -10px ${currentThemeColor}66` : 'none'
              }}
            >
              {targetColour ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in p-6 z-20">
                  <span className="text-white text-3xl md:text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] uppercase tracking-tight leading-tight mb-4">{targetColour.name}</span>
                  <span className="text-white/90 font-mono text-lg tracking-widest font-bold bg-black/40 backdrop-blur-sm px-5 py-2 rounded-full shadow-inner border border-white/20">
                    {targetColour.hex}
                  </span>
                </div>
              ) : (
                <span className="text-zinc-600 text-lg font-bold tracking-wide relative z-20">Press the button below</span>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none z-10"></div>
            </div>
            
            {!targetColour ? (
              <button 
                onClick={handleGenerate}
                className="w-full py-5 bg-gradient-to-r from-brand to-rose-500 text-white font-black tracking-wide text-xl rounded-2xl shadow-[0_0_30px_-5px_rgba(255,87,51,0.5)] active:scale-[0.98] transition-transform"
              >
                Generate Challenge
              </button>
            ) : (
              <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold rounded-2xl active:scale-[0.98] transition-all"
              >
                🎲 Reroll Colour
              </button>
            )}
          </div>
        )}

        {/* STEP 4: INSTRUCTIONS */}
        {step === 4 && (
          <div className="space-y-6">
            
            <div className="bg-brand/10 border border-brand/20 p-5 rounded-3xl mb-4 text-center">
              <p className="text-brand font-bold text-sm tracking-widest mb-1 uppercase">Your Target</p>
              <h3 className="text-2xl font-black text-white">{targetColour?.name || 'Awaiting'}</h3>
              <p className="text-brand/80 font-mono text-xs mt-1">{targetColour?.hex}</p>
            </div>

            <div className="bg-zinc-900 shadow-2xl relative overflow-hidden rounded-[2rem] p-8 border border-zinc-800/80">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-800/30 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mr-4 font-black text-2xl shadow-lg">
                  📸
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">How to play</h3>
              </div>
              
              <ol className="space-y-6 text-zinc-300 relative z-10 text-sm font-medium leading-relaxed">
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs mr-3 mt-0.5 shrink-0">1</span>
                  <p>Press your device's <b className="text-white">Home button</b> to leave this app. Keep it running in the background!</p>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs mr-3 mt-0.5 shrink-0">2</span>
                  <p>Open your native Camera. Walk around your city to find and capture exactly <b className="text-white">{gridSize * gridSize} photos</b> of the target hue.</p>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs mr-3 mt-0.5 shrink-0">3</span>
                  <p>Open your Gallery, select your {gridSize * gridSize} masterpieces, choose <b>Share</b>, and tap the <b className="text-brand">Colour Date</b> icon.</p>
                </li>
              </ol>
            </div>
            
          </div>
        )}

      </div>

      {/* Footer Nav */}
      <div className="mt-8">
        {step < 4 && (
          <button 
            disabled={step === 3 && !targetColour}
            onClick={advanceStep}
            className={`w-full py-4.5 font-black text-lg rounded-2xl active:scale-[0.98] transition-all ${step === 3 && !targetColour ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500' : 'bg-white text-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:bg-zinc-100'}`}
          >
            {step === 3 ? 'Accept Challenge' : 'Next Step'}
          </button>
        )}
      </div>

    </div>
  );
}
