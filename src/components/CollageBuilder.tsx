import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSharedImages, getSharedImages } from '../utils/idb';
import type { CropData } from './CropAdjust';

export function CollageBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(true);

  useEffect(() => {
    async function build() {
      try {
        const files = await getSharedImages();
        const cropDataRaw = sessionStorage.getItem('cropData');
        
        if (!files.length || !cropDataRaw) {
          navigate('/');
          return;
        }

        const cropData: CropData[] = JSON.parse(cropDataRaw);
        
        const loadedImages = await Promise.all(
          files.map((file, i) => {
            return new Promise<{ img: HTMLImageElement; crop: CropData }>((resolve, reject) => {
              const url = URL.createObjectURL(file);
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve({ img, crop: cropData[i] });
              img.onerror = reject;
              img.src = url;
            });
          })
        );

        const total = loadedImages.length;
        const gridN = Math.ceil(Math.sqrt(total)) || 1; 
        
        const CANVAS_SIZE = 1200; 
        const cellSize = CANVAS_SIZE / gridN;
        const canvas = canvasRef.current!;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#09090b'; 
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        loadedImages.forEach((item, i) => {
          const row = Math.floor(i / gridN);
          const col = i % gridN;
          
          const dx = col * cellSize;
          const dy = row * cellSize;

          ctx.save();
          
          ctx.beginPath();
          ctx.rect(dx, dy, cellSize, cellSize);
          ctx.clip();

          ctx.translate(dx + cellSize / 2, dy + cellSize / 2);

          const baseRatio = cellSize / 350; 
          
          ctx.translate(item.crop.x * baseRatio, item.crop.y * baseRatio);
          ctx.scale(item.crop.scale, item.crop.scale);

          const imgAspect = item.img.width / item.img.height;
          let drawW = cellSize;
          let drawH = cellSize;

          if (imgAspect > 1) {
             drawH = drawW / imgAspect;
          } else {
             drawW = drawH * imgAspect;
          }

          ctx.drawImage(
            item.img,
            -drawW / 2,
            -drawH / 2,
            drawW,
            drawH
          );

          ctx.restore();
        });

        // Add sleek minimal borders inside the grid
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        for (let i = 1; i < gridN; i++) {
          ctx.beginPath();
          ctx.moveTo(i * cellSize, 0);
          ctx.lineTo(i * cellSize, CANVAS_SIZE);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, i * cellSize);
          ctx.lineTo(CANVAS_SIZE, i * cellSize);
          ctx.stroke();
        }

        // Draw elegant outer border framing
        ctx.lineWidth = 24;
        ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCollageUrl(finalDataUrl);

      } catch (e) {
        console.error('Failed to build collage', e);
      } finally {
        setIsBuilding(false);
      }
    }

    build();
  }, [navigate]);

  const handleFinish = async () => {
    await clearSharedImages();
    sessionStorage.removeItem('cropData');
    navigate('/');
  };

  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Final Masterpiece</h1>
      <p className="text-zinc-500 text-sm text-center mb-8 font-medium">Your asynchronous date is complete!</p>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full pointer-events-none"></div>

        {isBuilding ? (
          <div className="relative z-10 flex flex-col items-center bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-10 rounded-[2rem] shadow-2xl">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-zinc-300 font-bold tracking-wide">Composing Photos...</p>
          </div>
        ) : collageUrl ? (
          <div className="relative z-10 w-full transform transition-all hover:scale-[1.02] duration-500 ease-out">
            <img 
              src={collageUrl} 
              alt="Final Collage" 
              className="w-full aspect-square rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-zinc-800/50 object-cover animate-fade-in"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-12 space-y-4 relative z-10 pb-4">
        {collageUrl && (
          <a
            href={collageUrl}
            download="ColourDate-Date.jpg"
            className="flex items-center justify-center w-full py-4.5 bg-white text-black font-black uppercase tracking-widest text-lg rounded-2xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all"
          >
            ↓ Save to Device
          </a>
        )}
        <button 
          onClick={handleFinish}
          className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-lg rounded-2xl active:scale-[0.98] transition-all"
        >
          Reset Session
        </button>
      </div>
    </div>
  );
}
