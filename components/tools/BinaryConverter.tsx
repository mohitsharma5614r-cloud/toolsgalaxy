
import React, { useState, useEffect, useRef } from 'react';

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-1/2 right-3 -translate-y-1/2 px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            disabled={!text}
            aria-label={`Copy ${text}`}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const NumberInput = ({ name, value, onChange, isValid, ...props }: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isValid: boolean }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Don't animate the input that the user is currently typing in
        if (document.activeElement?.ariaLabel !== name) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [value, name]);

    return (
        <div className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{name}</label>
            <input
                id={name}
                type="text"
                value={value}
                onChange={onChange}
                aria-label={name}
                className={`w-full bg-white dark:bg-slate-900/50 border-2 rounded-lg p-4 pr-20 text-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${!isValid ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} ${animate ? 'animate-pop-in' : ''}`}
                {...props}
            />
            <CopyButton text={value} />
        </div>
    );
};

export const BinaryConverter: React.FC = () => {
    const [values, setValues] = useState({ decimal: '', binary: '', hex: '' });
    const [errors, setErrors] = useState({ decimal: true, binary: true, hex: true });
    
    // Using a ref to track the source of the latest change to prevent feedback loops
    const lastChanged = useRef<string | null>(null);

    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        lastChanged.current = 'decimal';

        const isValid = /^[0-9]*$/.test(val);
        setErrors({ decimal: isValid, binary: true, hex: true });

        if (!isValid || val === '') {
            setValues({ decimal: val, binary: '', hex: '' });
            return;
        }

        const num = parseInt(val, 10);
        if (isNaN(num)) {
            setValues({ decimal: val, binary: '', hex: '' });
        } else {
            setValues({
                decimal: val,
                binary: num.toString(2),
                hex: num.toString(16).toUpperCase(),
            });
        }
    };

    const handleBinaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        lastChanged.current = 'binary';

        const isValid = /^[01]*$/.test(val);
        setErrors({ decimal: true, binary: isValid, hex: true });

        if (!isValid || val === '') {
            setValues({ decimal: '', binary: val, hex: '' });
            return;
        }

        const num = parseInt(val, 2);
        if (isNaN(num)) {
            setValues({ decimal: '', binary: val, hex: '' });
        } else {
            setValues({
                decimal: num.toString(10),
                binary: val,
                hex: num.toString(16).toUpperCase(),
            });
        }
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        lastChanged.current = 'hex';

        const isValid = /^[0-9a-fA-F]*$/.test(val);
        setErrors({ decimal: true, binary: true, hex: isValid });

        if (!isValid || val === '') {
            setValues({ decimal: '', binary: '', hex: val });
            return;
        }
        
        const num = parseInt(val, 16);
        if (isNaN(num)) {
            setValues({ decimal: '', binary: '', hex: val.toUpperCase() });
        } else {
            setValues({
                decimal: num.toString(10),
                binary: num.toString(2),
                hex: val.toUpperCase(),
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @keyframes pop-in {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.02); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.3s ease-out;
                }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Binary Converter</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert between decimal, binary, and hexadecimal systems.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    <NumberInput name="Decimal" value={values.decimal} onChange={handleDecimalChange} isValid={errors.decimal} />
                    <NumberInput name="Binary" value={values.binary} onChange={handleBinaryChange} isValid={errors.binary} />
                    <NumberInput name="Hexadecimal" value={values.hex} onChange={handleHexChange} isValid={errors.hex} />
                </div>
            </div>
        </div>
    );
};
