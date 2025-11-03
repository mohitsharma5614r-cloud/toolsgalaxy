
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEXT_SAMPLES = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the English alphabet. It is often used for touch-typing practice, so you can test your skills.",
  "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, innovations continue to shape our world in profound ways, creating both opportunities and challenges.",
  "The sun dipped below the horizon, painting the sky in shades of orange and pink. A gentle breeze rustled the leaves, creating a soothing melody that calmed the soul and brought peace.",
  "Never underestimate the power of a good book. It can transport you to different worlds, introduce you to fascinating characters, and expand your understanding of life, love, and loss.",
  "To be successful, you must dedicate yourself to your goals. Hard work, perseverance, and a positive mindset are the keys to unlocking your full potential and achieving your dreams.",
];

const TEST_DURATION = 60; // 60 seconds

export const TypingSpeedTest: React.FC = () => {
  const [status, setStatus] = useState<'waiting' | 'running' | 'finished'>('waiting');
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const startNewTest = useCallback(() => {
    setStatus('waiting');
    setUserInput('');
    setTimeRemaining(TEST_DURATION);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);
    const newText = TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];
    setText(newText);
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
    }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    startNewTest();
  }, [startNewTest]);

  useEffect(() => {
    if (status === 'running' && timeRemaining > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setStatus('finished');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [status, timeRemaining]);

  useEffect(() => {
    if (status === 'running') {
        const timeElapsed = TEST_DURATION - timeRemaining;
        const correctCharactersCount = userInput.split('').filter((char, index) => char === text[index]).length;
        const calculatedAccuracy = userInput.length > 0 ? (correctCharactersCount / userInput.length) * 100 : 100;
        
        const netWpm = (correctCharactersCount / 5) / (timeElapsed / 60);

        setWpm(timeElapsed > 0 ? Math.round(netWpm) : 0);
        setAccuracy(parseFloat(calculatedAccuracy.toFixed(2)));
        setCorrectChars(correctCharactersCount);
        setErrors(userInput.length - correctCharactersCount);
    }
  }, [userInput, timeRemaining, status, text]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (status === 'finished') return;

    if (status === 'waiting' && value.length > 0) {
      setStatus('running');
    }
    
    if (value.length <= text.length) {
      setUserInput(value);
    }
  };
  
  const focusInput = () => {
      if (status !== 'finished') {
          inputRef.current?.focus();
      }
  }

  const CharacterDisplay = React.memo(({ char, userChar, isCurrent }: { char: string, userChar?: string, isCurrent: boolean }) => {
    let charClass = 'text-slate-500 dark:text-slate-400';
    if (userChar !== undefined) {
      charClass = char === userChar ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400 bg-red-200/50 dark:bg-red-800/50 rounded';
    }
    
    return (
      <span className={`${charClass} relative`}>
        {isCurrent && <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-500 animate-pulse"></span>}
        {char === ' ' && userChar !== undefined && char !== userChar ? <span className="bg-red-200/50 dark:bg-red-800/50 rounded">_</span> : char}
      </span>
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Typing Speed Test</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">How fast can you type? Test your skills now!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Time</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{timeRemaining}s</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">WPM</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{wpm}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Accuracy</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Errors</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{errors}</p>
        </div>
      </div>

      <div className="relative">
        <div 
            className="text-2xl font-mono tracking-wide p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border-2 border-slate-200 dark:border-slate-700 leading-relaxed cursor-text select-none"
            onClick={focusInput}
            tabIndex={0}
            onFocus={focusInput}
        >
            {text.split('').map((char, index) => (
                <CharacterDisplay 
                    key={index} 
                    char={char} 
                    userChar={userInput[index]}
                    isCurrent={index === userInput.length}
                />
            ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
          value={userInput}
          onChange={handleInputChange}
          disabled={status === 'finished'}
          autoFocus
        />
      </div>
      
      <div className="mt-8 text-center">
        <button onClick={startNewTest} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 -mt-1"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
          Retry Test
        </button>
      </div>

      {status === 'finished' && (
        <div className="mt-8 p-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 animate-fade-in text-center">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Test Complete!</h2>
            <p className="text-lg text-emerald-700 dark:text-emerald-300 mt-2">Here's your result:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-slate-800 dark:text-slate-200">
                <p className="text-xl"><strong>WPM:</strong> {wpm}</p>
                <p className="text-xl"><strong>Accuracy:</strong> {accuracy}%</p>
                <p className="text-xl"><strong>Correct Characters:</strong> {correctChars}</p>
                <p className="text-xl"><strong>Errors:</strong> {errors}</p>
            </div>
        </div>
      )}
       <style>
      {`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
          }
      `}
      </style>
    </div>
  );
};
