export function StepLayoutSize({ setGridSize, onNext }: { setGridSize: (size: 2|3) => void, onNext: () => void }) {
  return (
    <main className="min-[100dvh] flex flex-col bg-background text-on-background animate-fade-in overflow-x-hidden">
      <section className="flex-1 flex flex-col p-8 md:p-20">
        <div className="mb-16 pt-8 md:pt-0">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-outline-variant mb-4">Step 01</p>
          <h2 className="font-headline text-4xl">Select your layout</h2>
        </div>
        <div className="flex flex-col border-t border-outline-variant/30 w-full outline-none">
          <button type="button" onClick={() => { setGridSize(2); onNext(); }} className="group py-12 flex justify-between items-center border-b border-x-0 border-t-0 border-outline-variant/30 bg-transparent hover:bg-surface-container-low active:bg-surface-container-low transition-colors px-4 relative outline-none cursor-pointer">
            <span className="font-headline text-3xl">2x2</span>
            <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </button>
          <button type="button" onClick={() => { setGridSize(3); onNext(); }} className="group py-12 flex justify-between items-center border-b border-x-0 border-t-0 border-outline-variant/30 bg-transparent hover:bg-surface-container-low active:bg-surface-container-low transition-colors px-4 relative outline-none cursor-pointer">
            <span className="font-headline text-3xl">3x3</span>
            <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </button>
        </div>
      </section>
    </main>
  );
}
