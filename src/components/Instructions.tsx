import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clearSharedImages, saveSharedImages } from "../utils/idb";

export function Instructions({ targetColour, gridSize }: { targetColour: { name: string, hex: string } | null, gridSize: number }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoCount = gridSize * gridSize;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await clearSharedImages();
    await saveSharedImages(Array.from(files));
    navigate('/crop');
  };

  return (
    <main className="min-h-[100svh] flex flex-col pt-safe pb-safe">
      <section className="flex-1 flex flex-col p-8 md:p-20 overflow-y-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12">
          <div>
            <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">The Brief</p>
            <h2 className="font-noto-serif text-4xl">Your objective</h2>
          </div>

          {targetColour && (
            <div className="flex items-center gap-4 bg-surface-container-low p-4">
              <div style={{ backgroundColor: targetColour.hex }} className="w-10 h-10"></div>
              <div>
                <p className="font-work-sans text-[9px] tracking-widest uppercase text-gray-500 leading-tight">Target Hue</p>
                <p className="font-noto-serif text-sm italic font-bold leading-tight">{targetColour.name}</p>
                <p className="font-work-sans text-[9px] text-gray-400 mt-0.5">{targetColour.hex}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-16 max-w-3xl mb-12">
          <div className="flex gap-8 items-start">
            <span className="font-noto-serif text-6xl text-outline-variant/40 leading-none">01</span>
            <div className="pt-2">
              <h4 className="font-work-sans font-medium uppercase tracking-widest text-xs mb-3">Observation</h4>
              <p className="text-lg leading-relaxed text-gray-600">Walk through the streets and look for textures, objects, or architecture that match the <span className="border-b border-primary/20 italic">{targetColour?.name || 'target hue'}</span> hue.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <span className="font-noto-serif text-6xl text-outline-variant/40 leading-none">02</span>
            <div className="pt-2">
              <h4 className="font-work-sans font-medium uppercase tracking-widest text-xs mb-3">Composition</h4>
              <p className="text-lg leading-relaxed text-gray-600">Photograph <span className="font-noto-serif italic">{photoCount}</span> distinct elements. Ensure the color remains the protagonist of your frame.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <span className="font-noto-serif text-6xl text-outline-variant/40 leading-none">03</span>
            <div className="pt-2">
              <h4 className="font-work-sans font-medium uppercase tracking-widest text-xs mb-3">Review</h4>
              <p className="text-lg leading-relaxed text-gray-600">Meet back at the starting point to compare your palettes and create the final archive.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <span className="font-noto-serif text-6xl text-outline-variant/40 leading-none">04</span>
            <div className="pt-2">
              <h4 className="font-work-sans font-medium uppercase tracking-widest text-xs mb-3">Upload</h4>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">Share your photos directly from your gallery to Colour Date, or use the button below to select them manually.</p>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden selectable"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[48px] px-8 py-4 border border-primary text-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:bg-surface-container-low"
              >
                SELECT PHOTOS
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full min-h-[48px] py-6 bg-primary text-on-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:opacity-80"
          >
            BACK TO MENU
          </button>
        </div>
      </section>
    </main>
  );
}
