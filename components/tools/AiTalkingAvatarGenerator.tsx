import React, { useState, useRef, useEffect } from 'react';

export const AiTalkingAvatarGenerator: React.FC<{ title: string }> = ({ title }) => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('robot');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawAvatar = (mouthOpen: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (selectedAvatar === 'robot') {
      // Robot head
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(centerX - 80, centerY - 80, 160, 160);
      
      // Eyes
      ctx.fillStyle = '#10B981';
      ctx.fillRect(centerX - 50, centerY - 40, 30, 30);
      ctx.fillRect(centerX + 20, centerY - 40, 30, 30);
      
      // Mouth
      ctx.fillStyle = '#EF4444';
      const mouthHeight = 10 + mouthOpen * 30;
      ctx.fillRect(centerX - 40, centerY + 20, 80, mouthHeight);
      
      // Antenna
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 80);
      ctx.lineTo(centerX, centerY - 110);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 110, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedAvatar === 'human') {
      // Face
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#1F2937';
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 20, 8, 0, Math.PI * 2);
      ctx.arc(centerX + 30, centerY - 20, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Mouth
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const mouthWidth = 40;
      const mouthY = centerY + 20;
      const mouthCurve = mouthOpen * 20;
      ctx.moveTo(centerX - mouthWidth, mouthY);
      ctx.quadraticCurveTo(centerX, mouthY + mouthCurve, centerX + mouthWidth, mouthY);
      ctx.stroke();
    } else {
      // Alien
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 90, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Large eyes
      ctx.fillStyle = '#1F2937';
      ctx.beginPath();
      ctx.arc(centerX - 35, centerY - 20, 20, 0, Math.PI * 2);
      ctx.arc(centerX + 35, centerY - 20, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye pupils
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 25, 8, 0, Math.PI * 2);
      ctx.arc(centerX + 40, centerY - 25, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Mouth
      ctx.fillStyle = '#1F2937';
      const alienMouthHeight = 5 + mouthOpen * 25;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 30, 30, alienMouthHeight, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const animate = () => {
    const mouthOpen = Math.random();
    drawAvatar(mouthOpen);
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleSpeak = () => {
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      animate();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      drawAvatar(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    drawAvatar(0);
  };

  useEffect(() => {
    drawAvatar(0);
  }, [selectedAvatar]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          Create talking avatars with text-to-speech (No API required!)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Avatar Display */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Avatar</h3>
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
          
          {/* Avatar Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedAvatar('robot')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAvatar === 'robot'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-purple-400'
                }`}
              >
                <div className="text-3xl mb-1">🤖</div>
                <div className="text-xs font-semibold">Robot</div>
              </button>
              <button
                onClick={() => setSelectedAvatar('human')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAvatar === 'human'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-purple-400'
                }`}
              >
                <div className="text-3xl mb-1">😊</div>
                <div className="text-xs font-semibold">Human</div>
              </button>
              <button
                onClick={() => setSelectedAvatar('alien')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAvatar === 'alien'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-purple-400'
                }`}
              >
                <div className="text-3xl mb-1">👽</div>
                <div className="text-xs font-semibold">Alien</div>
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Text to Speech</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type what you want the avatar to say..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  disabled={isSpeaking}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Voice
                </label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice || null);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-purple-500 transition-all"
                  disabled={isSpeaking}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking || !text.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSpeaking ? '🎤 Speaking...' : '🎤 Make Avatar Speak'}
                </button>
                {isSpeaking && (
                  <button
                    onClick={handleStop}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">ℹ️ Features:</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>No API required - uses browser's Web Speech API</li>
              <li>Choose from 3 different avatar styles</li>
              <li>Multiple voice options available</li>
              <li>Animated mouth movements while speaking</li>
              <li>Works completely offline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
