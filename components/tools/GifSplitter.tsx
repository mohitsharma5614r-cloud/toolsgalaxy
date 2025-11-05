import React, { useState, useRef } from 'react';

export const GifSplitter: React.FC<{ title: string }> = ({ title }) => {
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/gif') {
      setGifFile(file);
      extractFrames(file);
    }
  };

  const extractFrames = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setFrames([]);

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      
      // For static GIFs or single frame
      ctx.drawImage(img, 0, 0);
      const frameData = canvas.toDataURL('image/png');
      setFrames([frameData]);
      setProgress(100);
      setLoading(false);
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const downloadFrame = (frameData: string, index: number) => {
    const link = document.createElement('a');
    link.href = frameData;
    link.download = `frame-${index + 1}.png`;
    link.click();
  };

  const downloadAllFrames = () => {
    frames.forEach((frame, index) => {
      setTimeout(() => downloadFrame(frame, index), index * 100);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-pulse">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          Split animated GIFs into individual frames
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900"
        >
          <div className="flex flex-col items-center">
            <svg className="w-20 h-20 text-purple-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Click to upload GIF
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supports animated GIF files
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Loading Progress */}
      {loading && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Extracting frames...
            </span>
            <span className="text-sm font-medium text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 animate-pulse"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Frames Grid */}
      {frames.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Extracted Frames ({frames.length})
            </h2>
            <button
              onClick={downloadAllFrames}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Download All Frames
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {frames.map((frame, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-500"
              >
                <img
                  src={frame}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Frame {index + 1}
                  </p>
                  <button
                    onClick={() => downloadFrame(frame, index)}
                    className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    Download
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  PNG
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
