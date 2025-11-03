
import React, { useState, useRef, useEffect, useCallback } from 'react';

// Safely evaluates a math expression with a given 'x' value
const safeEval = (expr: string, x: number): number | null => {
    try {
        const scope = {
            x,
            sin: Math.sin, cos: Math.cos, tan: Math.tan,
            asin: Math.asin, acos: Math.acos, atan: Math.atan,
            sqrt: Math.sqrt, log: Math.log10, ln: Math.log,
            exp: Math.exp, abs: Math.abs, pow: Math.pow,
            PI: Math.PI, e: Math.E,
        };
        // Use the Function constructor for safer evaluation
        // The 'with' statement creates a scope for the expression
        return new Function('scope', `with(scope) { return ${expr} }`)(scope);
    } catch (e) {
        return null;
    }
};

// FIX: Add title prop to component.
export const GraphPlotter: React.FC<{ title: string }> = ({ title }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();

    const [expression, setExpression] = useState('sin(x) * 5');
    const [range, setRange] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    const [plotKey, setPlotKey] = useState(0);

    const draw = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const { width, height } = rect;

        ctx.clearRect(0, 0, width, height);

        const { xMin, xMax, yMin, yMax } = range;
        const xScale = width / (xMax - xMin);
        const yScale = height / (yMax - yMin);
        const xOrigin = -xMin * xScale;
        const yOrigin = yMax * yScale;
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
        const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
        const textColor = isDarkMode ? '#94a3b8' : '#64748b';
        const plotColor = isDarkMode ? '#818cf8' : '#6366f1';

        // Draw grid
        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = Math.floor(xMin); i <= xMax; i++) {
            const x = (i - xMin) * xScale;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let i = Math.floor(yMin); i <= yMax; i++) {
            const y = height - (i - yMin) * yScale;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;
        ctx.moveTo(0, yOrigin); ctx.lineTo(width, yOrigin); // X-axis
        ctx.moveTo(xOrigin, 0); ctx.lineTo(xOrigin, height); // Y-axis
        ctx.stroke();

        // Draw axis labels
        ctx.fillStyle = textColor;
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let i = Math.floor(xMin); i <= xMax; i++) {
            if (i !== 0) ctx.fillText(i.toString(), (i - xMin) * xScale, yOrigin + 5);
        }
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = Math.floor(yMin); i <= yMax; i++) {
            if (i !== 0) ctx.fillText(i.toString(), xOrigin - 5, height - (i - yMin) * yScale);
        }

        // Animated plotting
        let currentX = xMin;
        const step = (xMax - xMin) / (width * 2);
        ctx.beginPath();
        ctx.strokeStyle = plotColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        let firstPoint = true;

        const plotSegment = () => {
            const endX = Math.min(currentX + step * 25, xMax); // Draw in chunks
            let lastY = 0;

            for (; currentX < endX; currentX += step) {
                const yValue = safeEval(expression.replace(/x/g, `(${currentX})`), currentX);
                if (yValue !== null && isFinite(yValue)) {
                    const canvasX = (currentX - xMin) * xScale;
                    const canvasY = height - (yValue - yMin) * yScale;
                    
                    if (!firstPoint && Math.abs(canvasY - lastY) < height / 2) {
                        ctx.lineTo(canvasX, canvasY);
                    } else {
                        ctx.moveTo(canvasX, canvasY);
                    }
                    lastY = canvasY;
                    firstPoint = false;
                } else {
                    firstPoint = true;
                }
            }
            ctx.stroke();
            
            if (currentX < xMax) {
                // FIX: Pass the function reference `plotSegment` instead of calling `plotSegment()`.
                animationFrameId.current = requestAnimationFrame(plotSegment);
            }
        };

        // FIX: Pass the function reference `plotSegment` instead of calling `plotSegment()`.
        animationFrameId.current = requestAnimationFrame(plotSegment);

    }, [expression, range]);

    useEffect(() => {
        const handleResize = () => setPlotKey(k => k + 1);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        draw();
    }, [draw, plotKey]);
    
    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRange(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));
    };

    const handlePlot = () => {
        setPlotKey(prev => prev + 1);
    };
    
    const setExample = (exp: string) => {
        setExpression(exp);
        setPlotKey(k => k + 1);
    }

    const examples = ['x^2', 'sin(x)', 'cos(x)', 'tan(x)', 'log(x)', 'sqrt(x)'];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visualize mathematical functions in 2D with animated plotting.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Controls</h2>
                        <div>
                            <label htmlFor="expression" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">f(x) =</label>
                            <input
                                id="expression"
                                type="text"
                                value={expression}
                                onChange={e => setExpression(e.target.value)}
                                placeholder="e.g., x^2"
                                className="w-full font-mono bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">X Min</label>
                                <input type="number" name="xMin" value={range.xMin} onChange={handleRangeChange} className="w-full input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">X Max</label>
                                <input type="number" name="xMax" value={range.xMax} onChange={handleRangeChange} className="w-full input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Y Min</label>
                                <input type="number" name="yMin" value={range.yMin} onChange={handleRangeChange} className="w-full input-style" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Y Max</label>
                                <input type="number" name="yMax" value={range.yMax} onChange={handleRangeChange} className="w-full input-style" />
                            </div>
                        </div>
                        <button onClick={handlePlot} className="mt-6 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-transform hover:scale-105">
                            Plot Graph
                        </button>
                    </div>
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-3">Examples</h3>
                         <div className="flex flex-wrap gap-2">
                             {examples.map(ex => (
                                <button key={ex} onClick={() => setExample(ex)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    {ex}
                                </button>
                             ))}
                         </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <canvas ref={canvasRef} className="w-full h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 cursor-crosshair"></canvas>
                </div>
            </div>
            <style>{`
                .input-style {
                    font-family: monospace;
                    background-color: white;
                    border: 1px solid #cbd5e1;
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    width: 100%;
                }
                .dark .input-style {
                    background-color: rgba(15, 23, 42, 0.5);
                    border-color: #475569;
                    color: white;
                }
                .input-style:focus {
                     outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px #6366f1;
                    border-color: #6366f1;
                }
            `}</style>
        </div>
    );
};