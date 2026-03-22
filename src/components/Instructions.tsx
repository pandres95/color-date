import { useNavigate } from "react-router-dom";

export function Instructions({ targetColour }: { targetColour: { name: string, hex: string } | null }) {
  const navigate = useNavigate();
  
  return (
    <section className="flex-1 flex flex-col min-h-screen bg-background p-8 md:p-20 animate-fade-in text-on-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl lowercase tracking-tighter text-on-surface">COLOUR DATE</h1>
        <button type="button" onClick={() => navigate('/menu')} className="p-2 hover:bg-surface-container-low transition-colors active:opacity-70">
          <span className="material-symbols-outlined text-on-background">close</span>
        </button>
      </div>
      
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline-variant/30 pb-12">
        <div>
          <p className="font-label text-xs tracking-[0.2em] uppercase text-outline-variant mb-4">The Brief</p>
          <h2 className="font-headline text-4xl">Your objective</h2>
        </div>
        
        {targetColour && (
          <div className="flex items-center gap-4 bg-surface-container-low p-4">
            <div style={{ backgroundColor: targetColour.hex }} className="w-10 h-10 border border-black/5"></div>
            <div>
              <p className="font-label text-[9px] tracking-widest uppercase text-outline leading-tight">Target Hue</p>
              <p className="font-headline text-sm italic font-bold leading-tight">{targetColour.name}</p>
              <p className="font-label text-[9px] text-outline-variant mt-0.5">{targetColour.hex}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-16 max-w-3xl flex-1">
        <div className="flex gap-8 items-start">
          <span className="font-headline text-6xl text-outline-variant/40 leading-none">01</span>
          <div className="pt-2">
            <h4 className="font-label font-medium uppercase tracking-widest text-xs mb-3">Observation</h4>
            <p className="text-lg leading-relaxed text-secondary font-body">Walk through the streets and look for textures, objects, or architecture that match the target hue.</p>
          </div>
        </div>
        <div className="flex gap-8 items-start">
          <span className="font-headline text-6xl text-outline-variant/40 leading-none">02</span>
          <div className="pt-2">
            <h4 className="font-label font-medium uppercase tracking-widest text-xs mb-3">Composition</h4>
            <p className="text-lg leading-relaxed text-secondary font-body">Open your native Camera. Photograph distinct elements. Ensure the color remains the protagonist of your frame.</p>
          </div>
        </div>
        <div className="flex gap-8 items-start">
          <span className="font-headline text-6xl text-outline-variant/40 leading-none">03</span>
          <div className="pt-2">
            <h4 className="font-label font-medium uppercase tracking-widest text-xs mb-3">Review</h4>
            <p className="text-lg leading-relaxed text-secondary font-body">Open your Gallery, select your masterpieces, and tap <b>Share &gt; Colour Date</b> to create the final archive.</p>
          </div>
        </div>
      </div>

      <div className="mt-20 flex gap-4 pb-12">
        <button type="button" onClick={() => navigate('/menu')} className="w-full md:w-auto px-12 py-6 bg-primary text-on-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98] duration-150 border-0">
          BEGIN ARCHIVING
        </button>
      </div>
    </section>
  );
}
