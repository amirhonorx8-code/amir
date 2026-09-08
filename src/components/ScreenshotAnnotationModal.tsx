import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, 
  Square, 
  ArrowUpRight, 
  Type, 
  Undo2, 
  Check, 
  X, 
  Palette 
} from 'lucide-react';
import { ScreenshotAttachment } from '../utils/screenshotCapture';

interface ScreenshotAnnotationModalProps {
  isOpen: boolean;
  imageData: string | null;
  onClose: () => void;
  onAttach: (attachment: ScreenshotAttachment) => void;
}

type Tool = 'pen' | 'rectangle' | 'arrow' | 'text';

interface ActionHistory {
  type: 'draw' | 'rect' | 'arrow' | 'text';
  color: string;
  width: number;
  points?: { x: number; y: number }[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  text?: string;
  position?: { x: number; y: number };
}

export const ScreenshotAnnotationModal: React.FC<ScreenshotAnnotationModalProps> = ({
  isOpen,
  imageData,
  onClose,
  onAttach
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#ef4444');
  const [brushWidth, setBrushWidth] = useState<number>(3);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // Load image onto canvas when opened
  useEffect(() => {
    if (!isOpen || !imageData) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBgImage(img);
      setHistory([]);
      renderAll(img, []);
    };
    img.src = imageData;
  }, [isOpen, imageData]);

  const renderAll = (img: HTMLImageElement | null, actions: ActionHistory[], tempAction?: ActionHistory) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale canvas to fit max dimension
    const maxWidth = Math.min(window.innerWidth * 0.85, 960);
    const maxHeight = Math.min(window.innerHeight * 0.65, 600);

    if (img) {
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    const allActions = tempAction ? [...actions, tempAction] : actions;

    allActions.forEach((action) => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (action.type === 'draw' && action.points && action.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        for (let i = 1; i < action.points.length; i++) {
          ctx.lineTo(action.points[i].x, action.points[i].y);
        }
        ctx.stroke();
      } else if (action.type === 'rect' && action.start && action.end) {
        const x = Math.min(action.start.x, action.end.x);
        const y = Math.min(action.start.y, action.end.y);
        const w = Math.abs(action.end.x - action.start.x);
        const h = Math.abs(action.end.y - action.start.y);
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
      } else if (action.type === 'arrow' && action.start && action.end) {
        drawArrow(ctx, action.start.x, action.start.y, action.end.x, action.end.y, action.width);
      } else if (action.type === 'text' && action.position && action.text) {
        ctx.font = 'bold 18px Cairo, sans-serif';
        ctx.fillText(action.text, action.position.x, action.position.y);
      }
    });
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromx: number,
    fromy: number,
    tox: number,
    toy: number,
    width: number
  ) => {
    const headlen = 16;
    const angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (currentTool === 'pen') {
      setCurrentPoints([pos]);
    } else if (currentTool === 'text') {
      const text = window.prompt('أدخل النص المطلوب إضافته إلى الصورة:');
      if (text && text.trim()) {
        const newActions: ActionHistory[] = [
          ...history,
          {
            type: 'text',
            color: currentColor,
            width: brushWidth,
            position: pos,
            text: text.trim()
          }
        ];
        setHistory(newActions);
        renderAll(bgImage, newActions);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getCanvasCoords(e);

    if (currentTool === 'pen') {
      const updated = [...currentPoints, pos];
      setCurrentPoints(updated);
      renderAll(bgImage, history, {
        type: 'draw',
        color: currentColor,
        width: brushWidth,
        points: updated
      });
    } else if (currentTool === 'rectangle') {
      renderAll(bgImage, history, {
        type: 'rect',
        color: currentColor,
        width: brushWidth,
        start: startPos,
        end: pos
      });
    } else if (currentTool === 'arrow') {
      renderAll(bgImage, history, {
        type: 'arrow',
        color: currentColor,
        width: brushWidth,
        start: startPos,
        end: pos
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pos = getCanvasCoords(e);

    let newAction: ActionHistory | null = null;
    if (currentTool === 'pen' && currentPoints.length > 1) {
      newAction = {
        type: 'draw',
        color: currentColor,
        width: brushWidth,
        points: currentPoints
      };
    } else if (currentTool === 'rectangle') {
      newAction = {
        type: 'rect',
        color: currentColor,
        width: brushWidth,
        start: startPos,
        end: pos
      };
    } else if (currentTool === 'arrow') {
      newAction = {
        type: 'arrow',
        color: currentColor,
        width: brushWidth,
        start: startPos,
        end: pos
      };
    }

    if (newAction) {
      const updatedHistory = [...history, newAction];
      setHistory(updatedHistory);
      renderAll(bgImage, updatedHistory);
    }
    setCurrentPoints([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const next = history.slice(0, -1);
    setHistory(next);
    renderAll(bgImage, next);
  };

  const handleAttach = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const dataUrl = canvas.toDataURL('image/png');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `screenshot-annotated-${timestamp}.png`;

      onAttach({
        filename,
        mime_type: 'image/png',
        dataUrl,
        blob,
        size: blob.size
      });
      onClose();
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100002] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-200">تعديل وتحديد لقطة الشاشة (Annotate Screenshot)</span>
            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full font-mono">LlamaBot Editor</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTool('pen')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTool === 'pen'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="قلم حر"
            >
              <Pen className="w-4 h-4" />
              قلم
            </button>

            <button
              onClick={() => setCurrentTool('rectangle')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTool === 'rectangle'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="مربع تظليل"
            >
              <Square className="w-4 h-4" />
              مربع
            </button>

            <button
              onClick={() => setCurrentTool('arrow')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTool === 'arrow'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="سهم توضيحي"
            >
              <ArrowUpRight className="w-4 h-4" />
              سهم
            </button>

            <button
              onClick={() => setCurrentTool('text')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTool === 'text'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="إضافة نص"
            >
              <Type className="w-4 h-4" />
              نص
            </button>

            <div className="w-[1px] h-6 bg-slate-700 mx-1" />

            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="تراجع عن آخر رسمة"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Color swatches */}
            <div className="flex items-center gap-1.5">
              {['#ef4444', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    currentColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent'
                  }`}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-none ml-1"
                title="لون مخصص"
              />
            </div>

            <div className="w-[1px] h-6 bg-slate-700" />

            {/* Stroke width */}
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <span className="text-[11px] text-slate-400">السمك:</span>
              {[2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => setBrushWidth(w)}
                  className={`px-2 py-1 rounded text-xs ${
                    brushWidth === w ? 'bg-slate-700 text-white font-bold' : 'hover:bg-slate-800'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-auto min-h-[380px]">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-slate-800 rounded-lg shadow-2xl bg-slate-900 cursor-crosshair max-w-full"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950">
          <span className="text-xs text-slate-400">
            💡 يمكنك استخدام السهم والمستطيل للإشارة إلى الأخطاء أو العناصر المراد تعديلها.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleAttach}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              إرفاق بالملاحظة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
