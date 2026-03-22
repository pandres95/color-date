import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (searchParams.get('shared') === 'true') {
      navigate('/crop', { replace: true });
      return;
    }

    const checkStandalone = () => {
      const matchMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone === true);
      
      if (matchMedia || isIosStandalone) {
        navigate('/menu', { replace: true });
      }
    };

    checkStandalone();
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        navigate('/menu', { replace: true });
      }
    };
    mediaQuery.addEventListener('change', handler);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate, searchParams]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center p-6 w-full animate-fade-in">
      
      {/* Immersive Background Glow */}
      <div className="absolute top-1/4 w-64 h-64 bg-brand/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-brand to-rose-500 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(255,87,51,0.5)] flex items-center justify-center text-5xl mb-8 animate-float border border-white/20">
        ✨
      </div>
      
      <h1 className="relative z-10 text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 mb-4">
        Colour Date
      </h1>
      
      <p className="relative z-10 text-lg text-zinc-400 max-w-[280px] font-medium leading-relaxed">
        Let's sync up! Install the app to your device to begin the photo challenge.
      </p>

      {deferredPrompt ? (
        <div className="relative z-10 w-full max-w-xs mt-12">
          <button 
            type="button"
            onClick={handleInstallClick}
            className="w-full py-4.5 bg-white text-black font-black uppercase tracking-widest text-lg rounded-2xl shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] active:scale-95 transition-all"
          >
            Install App
          </button>
        </div>
      ) : (
        <div className="relative z-10 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl max-w-sm shadow-2xl mt-12 w-full text-left">
          <h3 className="text-white font-bold mb-4 text-center">Manual Setup Required</h3>
          <ol className="space-y-4 text-zinc-400 text-sm">
            <li className="flex items-start">
              <span className="bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0 shadow-sm">1</span>
              <span>Tap the <b>menu icon</b> (share or three dots) in your browser.</span>
            </li>
            <li className="flex items-start bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
              <span className="bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0 shadow-sm">2</span>
              <span>Select <b className="text-white">"Add to Home screen"</b> or "Install app".</span>
            </li>
            <li className="flex items-start">
              <span className="bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0 shadow-sm">3</span>
              <span>Open the app directly from your home screen!</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
