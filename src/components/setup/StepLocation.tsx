export function StepLocation({ setCity, onNext }: { setCity: (city: 'Bogota' | 'Toulouse') => void, onNext: () => void }) {
  return (
    <main className="min-h-[100svh] flex flex-col pt-safe pb-safe">
      {/* VIEW 3: LOCATION — exact Stitch markup */}
      <section className="flex-1 flex flex-col p-8 md:p-20">
        <div className="mb-16">
          <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">Step 02</p>
          <h2 className="font-noto-serif text-4xl">Where are we exploring today?</h2>
        </div>
        <div className="flex flex-col">
          {([{ label: 'Bogotá', value: 'Bogota' as const }, { label: 'Toulouse', value: 'Toulouse' as const }]).map((city) => (
            <button
              key={city.value}
              type="button"
              onClick={() => {
                setCity(city.value);
                onNext();
              }}
              className="group min-h-[80px] py-8 flex justify-between items-center bg-surface-container-low mb-1 px-6 transition-all active:bg-surface-container-highest"
            >
              <span className="font-noto-serif text-3xl">{city.label}</span>
              <span className="material-symbols-outlined opacity-30 group-active:opacity-100 transition-opacity">location_on</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
