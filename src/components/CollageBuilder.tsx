import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSharedImages } from '../utils/idb';
import type { CropData } from './CropAdjust';
import type { ChallengeData } from './MainMenu';

export function CollageBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<{ url: string; crop: CropData }[]>([]);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(true);
  const [extractedHues, setExtractedHues] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [gridN, setGridN] = useState(3);

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
        const total = files.length;
        const n = Math.ceil(Math.sqrt(total)) || 1;
        setGridN(n);

        // Create image URLs and pair with crop data
        const imageData = files.map((file, i) => ({
          url: URL.createObjectURL(file),
          crop: cropData[i] || { x: 0, y: 0, scale: 1, viewportSize: 350 }
        }));
        setImages(imageData);

        // Load images for canvas rendering
        const loadedImages = await Promise.all(
          files.map((file, i) => {
            return new Promise<{ img: HTMLImageElement; crop: CropData }>((resolve, reject) => {
              const url = URL.createObjectURL(file);
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve({ img, crop: cropData[i] || { x: 0, y: 0, scale: 1, viewportSize: 350 } });
              img.onerror = reject;
              img.src = url;
            });
          })
        );

        const CANVAS_SIZE = 1200; 
        const cellSize = CANVAS_SIZE / n;
        const canvas = canvasRef.current!;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#FAFAFA'; 
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

          const row = Math.floor(i / n);
          const col = i % n;
          
          const dx = col * cellSize;
          const dy = row * cellSize;

          ctx.save();
          
          ctx.beginPath();
          ctx.rect(dx, dy, cellSize, cellSize);
          ctx.clip();

          ctx.translate(dx + cellSize / 2, dy + cellSize / 2);

          // Use actual viewport size from crop session for correct scaling
          const vpSize = item.crop.viewportSize || 350;
          const baseRatio = cellSize / vpSize;
          
          ctx.translate(item.crop.x * baseRatio, item.crop.y * baseRatio);
          ctx.scale(item.crop.scale, item.crop.scale);

          // Cover-fill: scale image to fill cell
          const imgAspect = item.img.width / item.img.height;
          let drawW: number;
          let drawH: number;

          if (imgAspect > 1) {
            drawH = cellSize;
            drawW = cellSize * imgAspect;
          } else {
            drawW = cellSize;
            drawH = cellSize / imgAspect;
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

        setExtractedHues(hues.slice(0, 8));

        // Draw grid separators
        ctx.strokeStyle = '#FAFAFA';
        ctx.lineWidth = 4;
        for (let i = 1; i < n; i++) {
          ctx.beginPath();
          ctx.moveTo(i * cellSize, 0);
          ctx.lineTo(i * cellSize, CANVAS_SIZE);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, i * cellSize);
          ctx.lineTo(CANVAS_SIZE, i * cellSize);
          ctx.stroke();
        }

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

  const handleShare = async () => {
    if (!collageUrl) return;
    try {
      const response = await fetch(collageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'ColourDate.jpg', { type: 'image/jpeg' });
      await navigator.share({ files: [file], title: 'Colour Date' });
    } catch (e) {
      // User cancelled or share not supported — fall back to download
      const a = document.createElement('a');
      a.href = collageUrl;
      a.download = 'ColourDate.jpg';
      a.click();
    }
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-surface pt-safe">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/menu')} className="p-2 hover:bg-on-surface/5 transition-colors active:opacity-70">
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-24 px-6 pb-24">
        <div className="max-w-screen-md w-full">
          {/* Editorial Header Section */}
          <div className="mb-12 border-l-4 border-primary pl-6">
            <h2 className="font-noto-serif text-4xl lg:text-5xl text-on-surface mb-2">Final Composition</h2>
            <p className="font-work-sans uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              {challenge ? `${challenge.targetColour.name}, ${challenge.city.toUpperCase()}` : 'LOADING...'}
            </p>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Image Grid — matches Stitch layout */}
          <div className="bg-surface-container-low p-1 mb-12">
            {isBuilding ? (
              <div className="aspect-square flex items-center justify-center bg-surface-variant">
                <div className="w-12 h-12 bg-surface-container-highest animate-pulse"></div>
              </div>
            ) : (
              <div
                className="grid gap-1 aspect-square"
                style={{ gridTemplateColumns: `repeat(${gridN}, 1fr)` }}
              >
                {images.map((item, i) => (
                  <div key={i} className="aspect-square bg-surface-variant overflow-hidden">
                    <img
                      src={item.url}
                      alt={`Composition ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{
                        transform: `translate(${item.crop.x}px, ${item.crop.y}px) scale(${item.crop.scale})`,
                        transformOrigin: 'center center'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata / Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="font-work-sans uppercase tracking-[0.2em] text-[10px] text-on-surface-variant block mb-4">Provenance</span>
              <p className="font-inter text-sm leading-relaxed text-on-surface">
                A curated exploration of hue found in the contrasting urban landscapes of your city. 
                This composition captures the organic vibrancy against the specific hues of your colour date.
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex gap-2 mb-2">
                {extractedHues.map((hue, i) => (
                  <div key={i} className="w-4 h-4" style={{ backgroundColor: hue }}></div>
                ))}
              </div>
              <span className="font-work-sans text-[10px] tracking-[0.1em] text-on-surface-variant uppercase">
                HUE EXTRACTION COMPLETE / 100% ACCURACY
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {collageUrl && (
              <a
                href={collageUrl}
                download="ColourDate.jpg"
                className="flex-1 bg-primary text-on-primary py-4 px-8 font-work-sans uppercase tracking-[0.2em] text-sm transition-colors duration-200 active:scale-[0.98] text-center"
              >
                DOWNLOAD
              </a>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 border border-primary text-primary py-4 px-8 font-work-sans uppercase tracking-[0.2em] text-sm hover:bg-on-surface/5 transition-colors duration-200 active:scale-[0.98]"
            >
              SHARE
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
