
import React, { useState } from 'react';

interface ImageComparisonSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({ beforeImageUrl, afterImageUrl }) => {
    const [sliderPos, setSliderPos] = useState(50);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPos(Number(e.target.value));
    };

    return (
        <div className="relative w-full max-w-full aspect-video mx-auto rounded-xl overflow-hidden select-none group border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            {/* Before Image */}
            <img 
                src={beforeImageUrl} 
                alt="Before" 
                className="block w-full h-full object-contain pointer-events-none" 
            />

            {/* After Image Container (clipped) */}
            <div 
                className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" 
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
                <img 
                    src={afterImageUrl} 
                    alt="After" 
                    className="block w-full h-full object-contain"
                />
            </div>
            
            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white/70 cursor-ew-resize shadow-md pointer-events-none"
                style={{ left: `calc(${sliderPos}% - 2px)` }}
            >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center backdrop-blur-sm cursor-ew-resize shadow-lg">
                    <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-4-4v8m4 4h-8m4 4v-8" />
                    </svg>
                </div>
            </div>
            
             {/* Labels */}
             <div className="absolute top-2 left-2 px-3 py-1 bg-black/50 text-white text-sm font-semibold rounded-full pointer-events-none">
                Before
            </div>
            <div 
                className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white text-sm font-semibold rounded-full pointer-events-none transition-opacity duration-300"
                style={{ clipPath: `polygon(${sliderPos - 5}% 0, 100% 0, 100% 100%, ${sliderPos - 5}% 100%)` }}
            >
                After
            </div>

            {/* Range Input Overlay */}
            <input 
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={handleSliderChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                aria-label="Image comparison slider"
            />
        </div>
    );
};
