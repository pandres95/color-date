export function StepLocation({ setCity, onNext }: { setCity: (city: 'Bogota' | 'Toulouse') => void, onNext: () => void }) {
  return (
    <main className="min-[100dvh] flex flex-col bg-background text-on-background animate-fade-in overflow-x-hidden">
      <section className="flex-1 flex flex-col p-8 md:p-20">
        <div className="mb-16 pt-8 md:pt-0">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-outline-variant mb-4">Step 02</p>
          <h2 className="font-headline text-4xl">Where are we exploring today?</h2>
        </div>
        <div className="flex flex-col border-t border-outline-variant/30 w-full outline-none">
          <button type="button" onClick={() => { setCity('Bogota'); onNext(); }} className="group py-12 flex justify-between items-center border-b border-x-0 border-t-0 border-outline-variant/30 bg-transparent hover:bg-surface-container-low active:bg-surface-container-low transition-colors px-4 relative outline-none cursor-pointer text-left">
            <span className="font-headline text-3xl">Bogotá</span>
            <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 transition-opacity">location_on</span>
          </button>
          <button type="button" onClick={() => { setCity('Toulouse'); onNext(); }} className="group py-12 flex justify-between items-center border-b border-x-0 border-t-0 border-outline-variant/30 bg-transparent hover:bg-surface-container-low active:bg-surface-container-low transition-colors px-4 relative outline-none cursor-pointer text-left">
            <span className="font-headline text-3xl">Toulouse</span>
            <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 transition-opacity">location_on</span>
          </button>
        </div>
      </section>
    </main>
  );
}
