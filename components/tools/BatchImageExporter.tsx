import React, { useState, useRef } from 'react';

export const BatchImageExporter: React.FC<{ title: string }> = ({ title }) => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [quality, setQuality] = useState(0.9);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const convertAndDownload = async (img: { file: File; preview: string }, index: number) => {
    return new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve();
          return;
        }
        
        ctx.drawImage(image, 0, 0);
        
        const mimeType = `image/${exportFormat}`;
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${index + 1}.${exportFormat}`;
            link.click();
            URL.revokeObjectURL(url);
          }
          resolve();
        }, mimeType, quality);
      };
      image.src = img.preview;
    });
  };

  const exportAll = async () => {
    setExporting(true);
    for (let i = 0; i < images.length; i++) {
      await convertAndDownload(images[i], i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setExporting(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          Convert and export multiple images at once
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900"
        >
          <div className="flex flex-col items-center">
            <svg className="w-20 h-20 text-blue-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Click to upload images
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select multiple images (PNG, JPG, WebP)
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelect}
          className="hidden"
        />
      </div>

      {/* Export Settings */}
      {images.length > 0 && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Export Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Output Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={exportAll}
            disabled={exporting}
            className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Exporting...' : `Export All ${images.length} Images`}
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <img
                src={img.preview}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 truncate">
                  {img.file.name}
                </p>
                <button
                  onClick={() => removeImage(index)}
                  className="w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {exportFormat.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
