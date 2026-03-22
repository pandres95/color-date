import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ChallengeData } from './MainMenu';
import { StepLayoutSize } from './setup/StepLayoutSize';
import { StepLocation } from './setup/StepLocation';
import { StepTargetHue } from './setup/StepTargetHue';
import { Instructions } from './Instructions';

type City = 'Bogota' | 'Toulouse';

export function SetupDate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Single Source of Truth for Flow State
  const [step, setStep] = useState(1);
  const [gridSize, setGridSize] = useState<2 | 3>(2);
  const [city, setCity] = useState<City>('Bogota');
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

  const advanceStep = () => {
    if (step === 3 && targetColour) {
      // Save full sequence to persistence!
      const data: ChallengeData = { gridSize, city, targetColour };
      localStorage.setItem('colorDate_challenge', JSON.stringify(data));
      setStep(4);
    } else {
      setStep(s => Math.min(s + 1, 4));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main Return acts as a State Machine Container
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 pointer-events-none">
        {step < 4 && (
          <button type="button" onClick={() => navigate('/menu')} className="pointer-events-auto p-2 hover:bg-surface-container-low transition-colors active:opacity-70 bg-background/80 backdrop-blur-sm rounded-none border-0 text-on-surface">
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        )}
      </div>

      {step === 1 && (
        <StepLayoutSize setGridSize={setGridSize} onNext={advanceStep} />
      )}

      {step === 2 && (
        <StepLocation setCity={setCity} onNext={advanceStep} />
      )}

      {step === 3 && (
        <StepTargetHue 
          city={city} 
          targetColour={targetColour} 
          setTargetColour={setTargetColour} 
          onAccept={advanceStep} 
        />
      )}

      {step === 4 && (
        <Instructions targetColour={targetColour} />
      )}
    </>
  );
}
