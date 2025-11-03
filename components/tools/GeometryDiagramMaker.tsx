import React, { useState, useRef, useEffect, useCallback } from 'react';

type Point = { x: number; y: number };

interface BaseShape {
  id: number;
  type: Tool;
  color: string;
  lineWidth: number;
}
interface Line extends BaseShape { type: 'line'; start: Point; end: Point; }
interface Rect extends BaseShape { type: 'rect'; start: Point; width: number; height: number; }
interface Circle extends BaseShape { type: 'circle'; center: Point; radius: number; }

type Shape = Line | Rect | Circle;
type Tool = 'line' | 'rect' | 'circle';

const toolIcons = {
  line: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line></svg>,
  rect: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
  circle: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>,
};

const BlueprintLoader: React.FC = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 pointer-events-none">
        <svg className="blueprint-loader" width="120" height="120" viewBox="0 0 120 120">
            <rect className="blueprint-shape" x="10" y="10" width="100" height="100" rx="5" />
            <circle className="blueprint-shape" cx="60" cy="60" r="40" />
            <polyline className="blueprint-shape" points="20,100 60,20 100,100" />
        </svg>
        <p className="mt-4 text-lg font-semibold">Start drawing on the canvas!</p>
    </div>
);

export const GeometryDiagramMaker: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState<Tool>('line');
    const [color, setColor] = useState('#6366f1');
    const [lineWidth, setLineWidth] = useState(3);
    const [shapes, setShapes] = useState<Shape[]>([]);
    
    const isDrawing = useRef(false);
    const startPoint = useRef<Point>({ x: 0, y: 0 });
    const lastShapeId = useRef(0);

    const getCanvasCoordinates = (event: React.MouseEvent): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        shapes.forEach(shape => {
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = shape.lineWidth;
            ctx.beginPath();
            if (shape.type === 'line') {
                ctx.moveTo(shape.start.x, shape.start.y);
                ctx.lineTo(shape.end.x, shape.end.y);
            } else if (shape.type === 'rect') {
                ctx.rect(shape.start.x, shape.start.y, shape.width, shape.height);
            } else if (shape.type === 'circle') {
                ctx.arc(shape.center.x, shape.center.y, shape.radius, 0, 2 * Math.PI);
            }
            ctx.stroke();
        });
    }, [shapes]);

    useEffect(() => {
        redrawCanvas();
        const handleResize = () => redrawCanvas();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [redrawCanvas]);


    const handleMouseDown = (e: React.MouseEvent) => {
        isDrawing.current = true;
        const currentPoint = getCanvasCoordinates(e);
        startPoint.current = currentPoint;
        lastShapeId.current = Date.now();
        
        const newShape: Shape = {
            id: lastShapeId.current, type: tool, color, lineWidth,
            ... (tool === 'line' && { start: currentPoint, end: currentPoint }),
            ... (tool === 'rect' && { start: currentPoint, width: 0, height: 0 }),
            ... (tool === 'circle' && { center: currentPoint, radius: 0 }),
        } as Shape;

        setShapes(prev => [...prev, newShape]);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing.current) return;
        const currentPoint = getCanvasCoordinates(e);

        setShapes(prevShapes => prevShapes.map(shape => {
            if (shape.id !== lastShapeId.current) return shape;

            if (shape.type === 'line') {
                return { ...shape, end: currentPoint };
            } else if (shape.type === 'rect') {
                return { ...shape, width: currentPoint.x - startPoint.current.x, height: currentPoint.y - startPoint.current.y };
            } else if (shape.type === 'circle') {
                const radius = Math.sqrt(Math.pow(currentPoint.x - startPoint.current.x, 2) + Math.pow(currentPoint.y - startPoint.current.y, 2));
                return { ...shape, radius };
            }
            return shape;
        }));
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };
    
    const clearCanvas = () => setShapes([]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Geometry Diagram Maker</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Draw and visualize basic geometric shapes.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Tools</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(toolIcons) as Tool[]).map(t => (
                                <button key={t} onClick={() => setTool(t)} className={`p-3 rounded-md transition-colors ${tool === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} title={t}>
                                    {toolIcons[t]}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Color</h3>
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-12 p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer" />
                    </div>
                     <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Line Width: {lineWidth}px</h3>
                        <input type="range" min="1" max="20" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                     <button onClick={clearCanvas} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        Clear Canvas
                    </button>
                </div>

                <div className="flex-grow relative">
                    <canvas 
                        ref={canvasRef}
                        className="w-full h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 cursor-crosshair"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                    {shapes.length === 0 && <BlueprintLoader />}
                </div>
            </div>
            <style>{`
                .blueprint-loader svg {
                    fill: none;
                    stroke: #94a3b8; /* slate-400 */
                    stroke-width: 2;
                }
                .dark .blueprint-loader svg {
                    stroke: #475569; /* slate-600 */
                }
                .blueprint-shape {
                    stroke-dasharray: 500;
                    stroke-dashoffset: 500;
                    animation: draw-blueprint 3s ease-in-out infinite;
                }
                .blueprint-shape:nth-child(2) { animation-delay: 0.5s; }
                .blueprint-shape:nth-child(3) { animation-delay: 1s; }
                
                @keyframes draw-blueprint {
                    30%, 70% {
                        stroke-dashoffset: 0;
                    }
                    100% {
                        stroke-dashoffset: -500;
                    }
                }
            `}</style>
        </div>
    );
};
