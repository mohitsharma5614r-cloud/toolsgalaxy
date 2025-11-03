
import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="scale-loader mx-auto">
            <div className="scale-arm">
                <div className="scale-pan left"></div>
                <div className="scale-pan right"></div>
            </div>
            <div className="scale-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing applicability...</p>
        <style>{`
            .scale-loader { width: 120px; height: 80px; position: relative; }
            .scale-base { width: 40px; height: 10px; background: #9ca3af; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .dark .scale-base { background: #64748b; }
            .scale-base::before { content:''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 40px 10px; border-color: transparent transparent #9ca3af transparent; }
            .dark .scale-base::before { border-color: transparent transparent #64748b transparent; }
            .scale-arm { width: 100%; height: 8px; background: #9ca3af; border-radius: 4px; position: absolute; top: 30px; transform-origin: center; animation: balance-scale 2s infinite ease-in-out; }
            .dark .scale-arm { background: #64748b; }
            .scale-pan { position: absolute; width: 30px; height: 15px; border: 2px solid #9ca3af; border-top: none; border-radius: 0 0 15px 15px; top: 10px; }
            .dark .scale-pan { border-color: #64748b; }
            .scale-pan.left { left: 0; }
            .scale-pan.right { right: 0; }
            @keyframes balance-scale { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
        `}</style>
    </div>
);

export const GstReverseChargeTool: React.FC<{ title: string }> = ({ title }) => {
    const [step, setStep] = useState(1);
    const [result, setResult] = useState<'Applicable' | 'Not Applicable' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnswer = (isApplicable: boolean) => {
        setIsLoading(true);
        setTimeout(() => {
            setResult(isApplicable ? 'Applicable' : 'Not Applicable');
            setIsLoading(false);
            setStep(3); // Go to result step
        }, 1500);
    };

    const handleReset = () => {
        setStep(1);
        setResult(null);
        setIsLoading(false);
    };
    
    return (
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col justify-center">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Determine if Reverse Charge Mechanism (RCM) is applicable.</p>
            </div>
            
            {isLoading ? <Loader /> :
             step === 1 ? (
                <div className="text-center space-y-4 animate-fade-in">
                    <p className="text-lg font-semibold">Is the supplier of goods/services registered under GST?</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setStep(2)} className="btn-secondary">No, they are Unregistered</button>
                        <button onClick={() => setStep(2)} className="btn-primary">Yes, they are Registered</button>
                    </div>
                </div>
            ) : step === 2 ? (
                 <div className="text-center space-y-4 animate-fade-in">
                    <p className="text-lg font-semibold">Are you receiving specified goods/services notified for RCM?</p>
                    <p className="text-sm text-slate-500">(e.g., Goods Transport Agency, Advocate services, Sponsorship, etc.)</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => handleAnswer(false)} className="btn-secondary">No</button>
                        <button onClick={() => handleAnswer(true)} className="btn-primary">Yes</button>
                    </div>
                     <button onClick={handleReset} className="text-sm text-slate-500 mt-4">← Back</button>
                </div>
            ) : result ? (
                 <div className="text-center space-y-4 animate-fade-in">
                    {result === 'Applicable' ? (
                        <>
                            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500 text-6xl">✓</div>
                            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Reverse Charge is Applicable</h2>
                            <p className="text-slate-600 dark:text-slate-400">You (the recipient) are liable to pay GST directly to the government on this transaction.</p>
                        </>
                    ) : (
                         <>
                            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-500 text-6xl">✗</div>
                            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Reverse Charge is Not Applicable</h2>
                             <p className="text-slate-600 dark:text-slate-400">The supplier is liable to charge and pay GST as per normal rules.</p>
                        </>
                    )}
                     <p className="text-xs text-slate-400">Disclaimer: This is a simplified tool. Always consult a tax professional.</p>
                     <button onClick={handleReset} className="btn-primary">Start Over</button>
                </div>
            ) : null}
             <style>{`
                .btn-primary { background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background: #e2e8f0; color: #334155; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .dark .btn-secondary { background: #334155; color: #e2e8f0; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
