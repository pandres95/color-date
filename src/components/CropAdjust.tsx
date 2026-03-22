import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSharedImages } from '../utils/idb';
import { useGesture } from '@use-gesture/react';

export interface CropData {
  x: number;
  y: number;
  scale: number;
  viewportSize: number;
}

export function CropAdjust() {
  const navigate = useNavigate();
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropDataList, setCropDataList] = useState<CropData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const x = useRef(0);
  const y = useRef(0);
  const scale = useRef(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const files = await getSharedImages();
        if (files.length === 0) {
          navigate('/');
          return;
        }
        const mapped = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setImages(mapped);
        setCropDataList(mapped.map(() => ({ x: 0, y: 0, scale: 1, viewportSize: 0 })));
      } catch (e) {
        console.error('Failed to load shared images', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [navigate]);

  // Reset transform when switching images
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate3d(${x.current}px, ${y.current}px, 0) scale(${scale.current})`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.current = dx;
        y.current = dy;
        applyTransform();
      },
      onPinch: ({ offset: [s] }) => {
        scale.current = s;
        applyTransform();
      }
    },
    {
      target: containerRef,
      drag: { from: () => [x.current, y.current] },
      pinch: { scaleBounds: { min: 0.5, max: 5 }, modifierKey: null, from: () => [scale.current, 0] }
    }
  );

  const applyTransform = () => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate3d(${x.current}px, ${y.current}px, 0) scale(${scale.current})`;
    }
  };

  const handleNext = () => {
    const viewportSize = containerRef.current?.clientWidth || 350;
    const newCropList = [...cropDataList];
    newCropList[currentIndex] = { x: x.current, y: y.current, scale: scale.current, viewportSize };
    setCropDataList(newCropList);

    if (currentIndex < images.length - 1) {
      x.current = newCropList[currentIndex + 1].x;
      y.current = newCropList[currentIndex + 1].y;
      scale.current = newCropList[currentIndex + 1].scale;
      
      setCurrentIndex(prev => prev + 1);
      setTimeout(applyTransform, 0); 
    } else {
      sessionStorage.setItem('cropData', JSON.stringify(newCropList));
      navigate('/collage', { replace: true });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 bg-surface-variant animate-pulse border-0"></div>
    </div>
  );
  if (!images.length) return null;

  const isLast = currentIndex === images.length - 1;

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full bg-surface flex justify-between items-center px-6 py-4 pt-safe">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/menu')} className="p-2 hover:bg-on-surface/5 transition-colors active:opacity-70">
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>
      </header>

      <main className="min-h-screen pt-24 pb-32 px-6 flex flex-col items-start max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-12">
          <p className="font-work-sans uppercase tracking-[0.2em] text-xs text-on-surface-variant mb-2">
            Editor — Photo {currentIndex + 1} of {images.length}
          </p>
          <h2 className="font-noto-serif text-4xl text-on-surface">Crop Photo</h2>
        </div>

        {/* Cropping Viewport — gesture target */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-surface-container-low ring-1 ring-outline-variant/10 overflow-hidden"
          style={{ touchAction: 'none' }}
        >
          {/* Grid Overlay (Editorial Guide) */}
          <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
            <div className="border-r border-b border-on-surface"></div>
            <div className="border-r border-b border-on-surface"></div>
            <div className="border-b border-on-surface"></div>
            <div className="border-r border-b border-on-surface"></div>
            <div className="border-r border-b border-on-surface"></div>
            <div className="border-b border-on-surface"></div>
            <div className="border-r border-on-surface"></div>
            <div className="border-r border-on-surface"></div>
            <div></div>
          </div>

          {/* Subject Image — full colour, no desaturation */}
          <img
            ref={imgRef}
            src={images[currentIndex].url}
            alt="Crop target"
            className="w-full h-full object-cover origin-center select-none cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          />

          {/* Interaction Cues (Corners) */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-20"></div>
        </div>

        {/* Instructions/Controls Cluster */}
        <div className="w-full mt-10 grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-work-sans uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">Action</span>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">pan_tool</span>
              <span className="font-work-sans uppercase tracking-[0.15em] text-xs">Pan to frame</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-work-sans uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">Method</span>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">pinch</span>
              <span className="font-work-sans uppercase tracking-[0.15em] text-xs">Zoom to focus</span>
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Action */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md px-6 py-8 flex flex-col items-center pb-safe">
        <button
          type="button"
          onClick={handleNext}
          className="w-full max-w-md bg-primary text-on-primary font-work-sans uppercase tracking-[0.2em] text-sm py-5 active:scale-[0.98] transition-all duration-150"
        >
          {isLast ? 'BUILD COLLAGE' : 'CONFIRM CROP'}
        </button>
      </div>
    </>
  );
}
