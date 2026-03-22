import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSharedImages, getSharedImages } from '../utils/idb';
import type { CropData } from './CropAdjust';
import type { ChallengeData } from './MainMenu';

export function CollageBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(true);
  const [extractedHues, setExtractedHues] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    async function build() {
      try {
        const files = await getSharedImages();
        const cropDataRaw = sessionStorage.getItem('cropData');
        const challengeRaw = localStorage.getItem('colorDate_challenge');
        
        if (challengeRaw) {
          setChallenge(JSON.parse(challengeRaw));
        }

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

        ctx.fillStyle = '#ffffff'; 
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        const tCtx = tempCanvas.getContext('2d');
        const hues: string[] = [];

        loadedImages.forEach((item, i) => {
          // Extract average hue
          if (tCtx) {
            tCtx.drawImage(item.img, 0, 0, item.img.width, item.img.height, 0, 0, 1, 1);
            const data = tCtx.getImageData(0, 0, 1, 1).data;
            hues.push(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
          }

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

        // Setup the maximum swatches (up to 8 visual swatches)
        setExtractedHues(hues.slice(0, 8));

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
    localStorage.removeItem('colorDate_challenge');
    navigate('/');
  };

  return (
    <div className="font-body text-on-background min-h-[100dvh] flex flex-col bg-background animate-fade-in relative z-0">
      
      {/* TopAppBar */}
      <header className="absolute top-0 w-full flex justify-between items-center px-6 py-4 bg-transparent z-50">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/menu')} className="material-symbols-outlined text-on-surface cursor-pointer hover:bg-black/5 p-2 transition-colors border-0 bg-transparent">close</button>
          <h1 className="font-serif text-2xl lowercase tracking-tighter text-on-surface">COLOUR DATE</h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-screen-md w-full">
          
          {/* Editorial Header Section */}
          <div className="mb-12 border-l-4 border-primary pl-6">
            <h2 className="font-headline text-4xl lg:text-5xl text-on-surface mb-2">Final Composition</h2>
            <p className="font-label uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              {challenge ? `${challenge.targetColour.name}, ${challenge.city.toUpperCase()}` : 'LOADING...'}
            </p>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Collage Display */}
          <div className="bg-surface-container-low p-1 mb-12 border border-outline-variant/20 shadow-xl shadow-black/5">
            {isBuilding ? (
              <div className="aspect-square flex flex-col items-center justify-center bg-surface-variant">
                  <div className="relative w-12 h-12 mb-6">
                    <div className="absolute inset-0 border-4 border-outline-variant/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
              </div>
            ) : collageUrl ? (
              <img src={collageUrl} alt="Final composition" className="w-full aspect-square object-cover shadow-sm animate-fade-in mix-blend-multiply" />
            ) : null}
          </div>

          {/* Metadata & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 border-t border-outline-variant/30 pt-8">
            <div>
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant block mb-4">Provenance</span>
              <p className="font-body text-sm leading-relaxed text-secondary pr-4">
                A curated exploration of hue found in the contrasting urban landscapes of your city. 
                This composition captures the organic vibrancy against the specific hues of your colour date.
              </p>
            </div>
            
            <div className="flex flex-col justify-start md:justify-end border-l border-outline-variant/30 pl-4 md:pl-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {extractedHues.map((hue, i) => (
                  <div key={i} className="w-8 h-8 md:w-6 md:h-6 border border-black/10 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: hue }}></div>
                ))}
              </div>
              <span className="font-label text-[10px] tracking-[0.1em] text-on-surface-variant uppercase">
                HUE EXTRACTION COMPLETE / 100% ACCURACY
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {collageUrl && (
              <a href={collageUrl} download="ColourDate-Date.jpg" className="flex-1 bg-primary text-on-primary py-4 px-8 font-label uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 transition-colors duration-200 active:scale-[0.98] text-center border border-primary flex items-center justify-center">
                DOWNLOAD
              </a>
            )}
            <button type="button" onClick={handleFinish} className="flex-1 border border-primary text-primary py-4 px-8 font-label uppercase tracking-[0.2em] text-sm hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.98] bg-transparent pb-[15px]">
              FINISH SESSION
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
