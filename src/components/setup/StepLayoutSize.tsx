export function StepLayoutSize({
  setGridSize,
  onNext,
}: {
  setGridSize: (size: number) => void;
  onNext: () => void;
}) {
  return (
    <main className="min-h-[100svh] flex flex-col pt-safe pb-safe">
      {/* VIEW 2: LAYOUT SELECTION — exact Stitch markup */}
      <section className="flex-1 flex flex-col p-8 md:p-20">
        <div className="mb-16">
          <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">Step 01</p>
          <h2 className="font-noto-serif text-4xl">Select your layout</h2>
        </div>
        <div className="flex flex-col">
          {(['2x2', '3x3', '4x4'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setGridSize(Number.parseInt(size[0]));
                onNext();
              }}
              className="group min-h-[80px] py-8 flex justify-between items-center bg-surface-container-low mb-1 px-6 transition-all active:bg-surface-container-highest"
            >
              <span className="font-noto-serif text-3xl">{size}</span>
              <span className="material-symbols-outlined opacity-30 group-active:opacity-100 transition-opacity">arrow_forward</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
