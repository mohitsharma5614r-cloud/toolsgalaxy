import React, { useState } from 'react';

export const AITalkingAvatarGenerator: React.FC<{ title: string }> = ({ title }) => {
  const [image, setImage] = useState<string | null>(null);
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const API_URL = 'http://localhost:3004/api/ai-video';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image || !script.trim()) {
      setError('Please upload an image and enter a script');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const response = await fetch(`${API_URL}/talking-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, script }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate avatar');
      }

      setProgress(100);
      setResult(data.videoUrl || 'processing');
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate talking avatar');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Create a talking avatar from a photo and script using AI
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Photo
          </h2>
          
          <div className="mb-4">
            <label className="block w-full">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                image 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}>
                {image ? (
                  <div className="relative">
                    <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Use clear, front-facing photos
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Best results with single person
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Good lighting recommended
            </p>
          </div>
        </div>

        {/* Script Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Enter Script
          </h2>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter the text you want your avatar to say... (e.g., Hello! I am your AI avatar. I can speak any text you provide.)"
            className="w-full h-48 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all resize-none text-slate-900 dark:text-white"
            disabled={loading}
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {script.length} characters
            </span>
            <span className="text-slate-500">
              Recommended: 50-500 characters
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !image || !script.trim()}
            className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Avatar...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Generate Talking Avatar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Processing...</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            AI is analyzing your photo and generating speech... This may take 20-30 seconds.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6 animate-shake">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Generation Failed</h3>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result - Coming Soon */}
      {result && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 border border-blue-200 dark:border-blue-700 animate-slide-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">🚀 Coming Soon!</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              AI Talking Avatar generation requires specialized APIs like D-ID or HeyGen. This feature will be available in a future update with API integration.
            </p>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">🎯 What You Can Try Now:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <a href="https://www.d-id.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">D-ID</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">20 free credits</div>
                  </div>
                </a>
                <a href="https://www.heygen.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">HeyGen</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">1 min free video</div>
                  </div>
                </a>
                <a href="https://runwayml.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Runway ML</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">125 free credits</div>
                  </div>
                </a>
                <a href="https://www.synthesia.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  <span className="text-2xl">🎥</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Synthesia</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Free trial</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your input has been saved. We'll notify you when this feature launches!</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Upload Photo</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose a clear, front-facing photo of a person.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Write Script</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Enter the text you want the avatar to speak.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-600 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Generate & Download</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">AI creates a talking avatar video for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
