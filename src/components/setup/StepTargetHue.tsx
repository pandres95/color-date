import { useEffect } from "react";
import { generateTargetColour } from "../../utils/colours";

export function StepTargetHue({ city, targetColour, setTargetColour, onAccept }: { city: 'Bogota' | 'Toulouse', targetColour: { name: string, hex: string } | null, setTargetColour: (colour: { name: string, hex: string }) => void, onAccept: () => void }) {
  
  // Auto-generate on mount if empty
  useEffect(() => {
    if (!targetColour) {
      setTargetColour(generateTargetColour(city));
    }
  }, [city, targetColour, setTargetColour]);

  const regenerateColor = () => {
    setTargetColour(generateTargetColour(city));
  };

  if (!targetColour) return null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden animate-fade-in bg-background text-on-background">
      {/* Color Block: 70% height */}
      <div style={{ backgroundColor: targetColour.hex }} className="h-[70dvh] w-full transition-colors duration-700"></div>
      
      {/* Content Area: 30% height */}
      <div className="h-[30dvh] p-6 md:p-12 flex flex-col justify-between bg-surface border-t border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-1">
            <h3 className="font-headline text-3xl md:text-4xl italic leading-none">{targetColour.name}</h3>
            <span className="font-label text-[10px] tracking-widest text-outline uppercase">{targetColour.hex}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button type="button" onClick={regenerateColor} className="flex-1 py-4 border border-primary text-primary bg-surface font-label text-[10px] tracking-[0.2em] uppercase hover:bg-surface-container-low transition-colors active:scale-[0.98] duration-150">
            REGENERATE
          </button>
          <button type="button" onClick={onAccept} className="flex-1 py-4 bg-primary text-on-primary font-label text-[10px] tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors active:scale-[0.98] duration-150 shadow-none border-0">
            ACCEPT CHALLENGE
          </button>
        </div>
      </div>
    </div>
  );
}
