import { useEffect } from "react";
import { generateTargetColour } from "../../utils/colours";

export function StepTargetHue({ city, targetColour, setTargetColour, onAccept }: { city: 'Bogota' | 'Toulouse', targetColour: { name: string, hex: string, hint: string } | null, setTargetColour: (colour: { name: string, hex: string, hint: string }) => void, onAccept: () => void }) {

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
    <main className="min-h-[100svh] flex flex-col pt-safe pb-safe">
      <section className="flex-1 flex flex-col h-[100svh] overflow-hidden">
        {/* Color Block: 70% height — full width, no padding */}
        <div style={{ backgroundColor: targetColour.hex }} className="h-svh-70 w-full transition-colors duration-700"></div>
        {/* Content Area: 30% height — only this has padding */}
        <div className="h-svh-30 p-6 md:p-12 flex flex-col justify-between bg-surface">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-1">
              <h3 className="font-noto-serif text-3xl md:text-4xl italic leading-none">{targetColour.name}</h3>
              <span className="font-work-sans text-[10px] tracking-widest text-gray-500 uppercase">{targetColour.hex}</span>
            </div>
            <p className="font-inter text-xs text-gray-500 italic mt-1">{targetColour.hint}</p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={regenerateColor}
              className="flex-1 min-h-[48px] py-4 border border-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:bg-surface-container-low"
            >
              REGENERATE
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 min-h-[48px] py-4 bg-primary text-on-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:opacity-80"
            >
              ACCEPT CHALLENGE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
