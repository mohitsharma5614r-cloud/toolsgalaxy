import React, { useState, useEffect } from 'react';

// A helper component for the animated result display
const AnimatedDisplay = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
  
    useEffect(() => {
      if (text !== displayText) {
        setIsAnimating(true);
        let animationTime = 0;
        const interval = setInterval(() => {
          animationTime += 50;
          if (animationTime >= 300) {
            clearInterval(interval);
            setIsAnimating(false);
            setDisplayText(text);
          } else {
            // Display random characters
            const randomText = text
              .toString()
              .split('')
              .map(() => Math.random() > 0.5 ? String.fromCharCode(Math.random() * 93 + 33) : ' ')
              .join('');
            setDisplayText(randomText);
          }
        }, 50);
  
        return () => clearInterval(interval);
      }
    }, [text, displayText]);
  
    return (
        <div className={`break-all text-right transition-colors duration-200 ${isAnimating ? 'text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
            {displayText}
        </div>
    );
  };

export const ScientificCalculator: React.FC = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('0');
    const [memory, setMemory] = useState(0);

    const formatExpression = (expr: string) => {
        return expr
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e');
    }
    
    // A safe evaluation function to avoid direct eval()
    const safeCalculate = (expr: string): number | string => {
        try {
            // Replace user-friendly symbols with JS Math equivalents
            let evalExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
                .replace(/sin\(([^)]+)\)/g, 'Math.sin(Math.PI / 180 * $1)') // Convert degrees to radians
                .replace(/cos\(([^)]+)\)/g, 'Math.cos(Math.PI / 180 * $1)')
                .replace(/tan\(([^)]+)\)/g, 'Math.tan(Math.PI / 180 * $1)')
                .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
                .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
                .replace(/\^/g, '**');

            // Final check for invalid characters before evaluation
            if (/[^0-9()+\-*/.eE\s\w]/.test(evalExpr.replace(/Math\./g, ''))) {
                return 'Error';
            }
            
            // Using Function constructor is safer than direct eval
            // eslint-disable-next-line no-new-func
            const calculatedResult = new Function('return ' + evalExpr)();

            if (typeof calculatedResult !== 'number' || !isFinite(calculatedResult)) {
                return 'Error';
            }
            
            // Format to a reasonable number of decimal places
            return parseFloat(calculatedResult.toPrecision(12));

        } catch (error) {
            return 'Error';
        }
    };
    
    const handleButtonClick = (value: string) => {
        if (result !== '0' && '0123456789.(πe'.includes(value) && !'+-×÷^'.includes(expression.slice(-1))) {
            if (!isNaN(parseFloat(result)) && !expression) {
                // If starting a new calculation after a result, clear everything
                setExpression('');
                setResult('0');
            }
        }

        switch (value) {
            case '=':
                if (expression) {
                    const finalResult = safeCalculate(expression);
                    setResult(finalResult.toString());
                    setExpression(finalResult.toString() === 'Error' ? '' : finalResult.toString());
                }
                break;
            case 'C':
                setExpression('');
                setResult('0');
                break;
            case 'CE':
                setExpression('');
                break;
            case '⌫':
                setExpression(prev => prev.slice(0, -1));
                break;
            case 'MC':
                setMemory(0);
                break;
            case 'MR':
                setExpression(prev => prev + memory.toString());
                break;
            case 'M+':
                if (expression) {
                    const currentVal = safeCalculate(expression);
                    if (typeof currentVal === 'number') {
                        setMemory(prev => prev + currentVal);
                        setResult(currentVal.toString());
                        setExpression('');
                    }
                }
                break;
            case 'M-':
                 if (expression) {
                    const currentVal = safeCalculate(expression);
                    if (typeof currentVal === 'number') {
                        setMemory(prev => prev - currentVal);
                        setResult(currentVal.toString());
                        setExpression('');
                    }
                }
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case '√':
                 setExpression(prev => prev + value + '(');
                 break;
            default:
                setExpression(prev => prev + value);
        }
    };
    
    const buttons = [
        ['sin', 'cos', 'tan', 'C', 'CE'],
        ['log', 'ln', '√', '(', ')'],
        ['π', 'e', '^', '⌫', '÷'],
        ['7', '8', '9', 'MC', '×'],
        ['4', '5', '6', 'MR', '-'],
        ['1', '2', '3', 'M+', '+'],
        ['0', '.', 'M-', '=']
    ];

    const getButtonClass = (btn: string) => {
        if ('+-×÷=^'.includes(btn)) return 'bg-indigo-500 hover:bg-indigo-600 text-white';
        if ('C CE ⌫'.includes(btn)) return 'bg-rose-500 hover:bg-rose-600 text-white';
        if ('sin cos tan log ln √ π e'.includes(btn)) return 'bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white';
        if ('MC MR M+ M-'.includes(btn)) return 'bg-slate-500 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white';
        return 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200';
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Scientific Calculator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your powerful tool for complex calculations.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
                {/* Display */}
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 mb-4 text-right overflow-x-auto">
                    <div className="h-8 text-slate-500 dark:text-slate-400 text-xl break-all">{formatExpression(expression)}</div>
                    <div className="h-12 text-5xl font-bold">
                        <AnimatedDisplay text={result} />
                    </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-5 gap-2">
                    {buttons.flat().map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => handleButtonClick(btn)}
                            className={`h-16 rounded-lg text-xl font-semibold transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 ${getButtonClass(btn)} ${btn === '=' ? 'col-span-2' : ''}`}
                        >
                            {btn === '√' ? '√' : btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
