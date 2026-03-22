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
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-brand rounded-full animate-spin"></div>
    </div>
  );
  if (!images.length) return null;

  const isLast = currentIndex === images.length - 1;

  return (
    <div className="flex flex-col h-[100dvh] bg-primary text-on-primary overflow-hidden relative animate-fade-in">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-20 mix-blend-difference pointer-events-none">
        <h2 className="font-headline text-2xl italic text-on-primary">Adjust.</h2>
        <button type="button" onClick={() => navigate('/menu')} className="pointer-events-auto p-2 text-on-primary hover:opacity-70 transition-opacity bg-transparent border-0">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Main Cropping Area (Gesture Receiver) */}
      <div className="flex-1 relative overflow-hidden touch-none flex flex-col justify-center items-center h-full w-full">
        <div 
          className="relative w-full aspect-square md:w-auto md:h-[70vh] md:aspect-[1/1] overflow-hidden border border-outline-variant/30 touch-none bg-[#1A1A1A]"
        >
          {/* Subtle Grid guides */}
          <div className="absolute inset-x-0 h-1/3 top-1/3 border-y border-outline-variant/20 pointer-events-none z-10 mix-blend-overlay" />
          <div className="absolute inset-y-0 w-1/3 left-1/3 border-x border-outline-variant/20 pointer-events-none z-10 mix-blend-overlay" />
          
          <img
            ref={imgRef}
            src={images[currentIndex].url}
            alt="Crop target"
            className="w-full h-full object-contain origin-center select-none cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-end z-20 mix-blend-difference pointer-events-none">
        <div>
          <p className="font-label text-[10px] tracking-widest uppercase text-on-primary/70 mb-2 md:mb-0">Pinch and drag</p>
          <p className="font-label text-[10px] tracking-widest uppercase text-on-primary/40 hidden md:block">Photo {currentIndex + 1} of {images.length}</p>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button 
            type="button"
            onClick={handleNext}
            className="w-full pointer-events-auto px-12 py-6 bg-on-primary text-primary font-label text-xs tracking-[0.2em] uppercase hover:bg-surface-container-low active:scale-[0.98] transition-all duration-300 border-0"
          >
            {isLast ? 'BUILD COLLAGE' : 'CONFIRM CROP'}
          </button>
        </div>
      </div>
      
    </div>
  );
}
