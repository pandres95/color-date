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
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 md:p-20 pt-[max(env(safe-area-inset-top),2rem)] md:pt-[max(env(safe-area-inset-top),5rem)] pb-[max(env(safe-area-inset-bottom),2rem)] md:pb-[max(env(safe-area-inset-bottom),5rem)] w-full animate-fade-in bg-background text-on-background space-y-12">
      
      <div className="max-w-2xl">
        <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight italic mb-6">
          Capture your city’s hues, together.
        </h1>
        
        <p className="text-lg text-on-surface-variant font-body mb-12">
          Let's sync up! Install the app to your device to begin the photo challenge.
        </p>
      </div>

      {deferredPrompt ? (
        <div className="w-full mt-auto">
          <button 
            type="button"
            onClick={handleInstallClick}
            className="w-full md:w-auto px-12 py-6 bg-primary text-on-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-primary-fixed-dim transition-colors duration-300 shadow-none border-0"
          >
            INSTALL APP
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl text-left bg-surface-container-low p-8 mt-12">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-outline mb-8">Manual Setup Required</p>
          <div className="space-y-8">
            <div className="flex gap-8 items-start">
              <span className="font-headline text-4xl text-outline-variant/60 leading-none">01</span>
              <div className="pt-1">
                <p className="text-lg leading-relaxed text-on-surface font-body">Tap the <b>menu icon</b> (share or three dots) in your browser.</p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <span className="font-headline text-4xl text-outline-variant/60 leading-none">02</span>
              <div className="pt-1">
                <p className="text-lg leading-relaxed text-on-surface font-body">Select <b className="bg-surface italic px-1">"Add to Home screen"</b> or "Install app".</p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <span className="font-headline text-4xl text-outline-variant/60 leading-none">03</span>
              <div className="pt-1">
                <p className="text-lg leading-relaxed text-on-surface font-body">Open the app directly from your home screen!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
