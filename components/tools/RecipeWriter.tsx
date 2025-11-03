import React, { useState } from 'react';
import { generateRecipe, Recipe } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="pot-loader mx-auto">
            <div className="pot">
                <div className="steam"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Simmering up a recipe...</p>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
        >
            {copied ? 'Copied!' : 'Copy Recipe'}
        </button>
    );
};

export const RecipeWriter: React.FC<{ title: string }> = ({ title }) => {
    const [dish, setDish] = useState('');
    const [constraints, setConstraints] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!dish.trim()) {
            setError("Please enter a dish name.");
            return;
        }
        setIsLoading(true);
        setRecipe(null);
        setError(null);

        try {
            const result = await generateRecipe(dish, constraints);
            setRecipe(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate recipe.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatForCopy = (): string => {
        if (!recipe) return '';
        let text = `${recipe.title}\n\n`;
        text += `${recipe.description}\n\n`;
        text += "INGREDIENTS:\n";
        text += recipe.ingredients.map(item => `- ${item}`).join('\n') + '\n\n';
        text += "INSTRUCTIONS:\n";
        text += recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🍲</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate recipes for your favorite dishes with AI.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dish Name</label>
                        <input value={dish} onChange={e => setDish(e.target.value)} placeholder="e.g., Chocolate Chip Cookies" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Optional Constraints</label>
                        <input value={constraints} onChange={e => setConstraints(e.target.value)} placeholder="e.g., vegetarian, gluten-free, quick and easy" className="w-full input-style" />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !dish.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                        {isLoading ? 'Generating...' : 'Generate Recipe'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : recipe ? (
                        <div className="w-full animate-fade-in text-left">
                            <h2 className="text-3xl font-bold text-center mb-2">{recipe.title}</h2>
                            <p className="text-center italic text-slate-500 dark:text-slate-400 mb-6">{recipe.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="font-bold text-lg mb-2">Ingredients</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="font-bold text-lg mb-2">Instructions</h3>
                                    <ol className="list-decimal list-inside space-y-2">
                                        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                                <CopyButton textToCopy={formatForCopy()} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your recipe will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .pot-loader { width: 100px; height: 100px; position: relative; }
                .pot { width: 80px; height: 60px; background: #9ca3af; border-radius: 10px 10px 40px 40px; position: absolute; bottom: 0; left: 10px; }
                .dark .pot { background: #475569; }
                .pot::before { content: ''; position: absolute; top: -5px; left: -5px; right: -5px; height: 10px; background: #64748b; border-radius: 8px; }
                .dark .pot::before { background: #9ca3b8; }
                .steam { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 4px; height: 20px; background: #e2e8f0; border-radius: 2px; animation: steam-rise 2s infinite linear; box-shadow: 15px 5px 0 0 #e2e8f0, -15px -5px 0 0 #e2e8f0; }
                .dark .steam { background: #475569; box-shadow: 15px 5px 0 0 #475569, -15px -5px 0 0 #475569; }
                @keyframes steam-rise { 0% { transform: translate(-50%, 0) scaleY(1); opacity: 1; } 100% { transform: translate(-60%, -40px) scaleY(1.5); opacity: 0; } }
            `}</style>
        </>
    );
};
