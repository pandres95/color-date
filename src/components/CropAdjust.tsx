import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSharedImages } from '../utils/idb';
import { useGesture } from '@use-gesture/react';

export interface CropData {
  x: number;
  y: number;
  scale: number;
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
        setCropDataList(mapped.map(() => ({ x: 0, y: 0, scale: 1 })));
      } catch (e) {
        console.error('Failed to load shared images', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [navigate]);

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
      target: imgRef,
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
    const newCropList = [...cropDataList];
    newCropList[currentIndex] = { x: x.current, y: y.current, scale: scale.current };
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
      <div className="w-12 h-12 border-4 border-zinc-800 border-t-brand rounded-full animate-spin"></div>
    </div>
  );
  if (!images.length) return null;

  const isLast = currentIndex === images.length - 1;

  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto py-8 px-4 text-white overflow-hidden">
      
      {/* Header Info */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">Refine Photo</h1>
          <p className="text-zinc-400 text-sm mt-1">Pinch to zoom, drag to pan</p>
        </div>
        <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl shadow-inner">
          <span className="text-brand font-black text-xl">{currentIndex + 1}</span>
          <div className="w-8 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full perspective-1000">
        
        {/* Background ambient glow matching the image container */}
        <div className="absolute inset-0 bg-brand/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div 
          className="relative w-full aspect-square bg-zinc-950/80 backdrop-blur-md overflow-hidden rounded-[2rem] border border-zinc-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] touch-none ring-1 ring-white/10"
        >
          {/* Subtle Grid guides */}
          <div className="absolute inset-x-0 h-1/3 top-1/3 border-y border-white/10 pointer-events-none z-10 mix-blend-overlay" />
          <div className="absolute inset-y-0 w-1/3 left-1/3 border-x border-white/10 pointer-events-none z-10 mix-blend-overlay" />
          
          {/* Corner indicators */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-sm pointer-events-none z-20"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-sm pointer-events-none z-20"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-sm pointer-events-none z-20"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-sm pointer-events-none z-20"></div>

          <img
            ref={imgRef}
            src={images[currentIndex].url}
            alt="Crop target"
            className="w-full h-full object-contain origin-center select-none"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-10 pb-4">
        <button 
          onClick={handleNext}
          className={`w-full py-4.5 font-black text-lg text-white rounded-2xl shadow-xl active:scale-[0.98] transition-all relative overflow-hidden group ${isLast ? 'bg-gradient-to-r from-brand to-rose-500 shadow-brand/20 border border-brand/50' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'}`}
        >
          {/* Shine effect on final button */}
          {isLast && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>}
          
          <span className="relative z-10 flex items-center justify-center">
            {isLast ? '✨ Build Collage' : 'Confirm & Next →'}
          </span>
        </button>
      </div>
    </div>
  );
}
