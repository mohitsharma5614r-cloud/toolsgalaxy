import React, { useState, useRef, useEffect } from 'react';

interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    level: number;
    parent?: string;
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating concept map...</p>
    </div>
);

export const AiConceptMapGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    // Generate concept map data
    const generateConceptMap = (centralTopic: string) => {
        const newNodes: Node[] = [];
        const centerX = 400;
        const centerY = 300;

        // Central node
        newNodes.push({
            id: 'center',
            text: centralTopic,
            x: centerX,
            y: centerY,
            level: 0
        });

        // Generate main branches based on topic
        const mainBranches = generateMainBranches(centralTopic);
        const angleStep = (2 * Math.PI) / mainBranches.length;

        mainBranches.forEach((branch, index) => {
            const angle = index * angleStep;
            const distance = 180;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            const branchId = `branch-${index}`;
            newNodes.push({
                id: branchId,
                text: branch,
                x,
                y,
                level: 1,
                parent: 'center'
            });

            // Generate sub-branches
            const subBranches = generateSubBranches(branch);
            subBranches.forEach((subBranch, subIndex) => {
                const subAngle = angle + (subIndex - 1) * 0.5;
                const subDistance = 120;
                const subX = x + Math.cos(subAngle) * subDistance;
                const subY = y + Math.sin(subAngle) * subDistance;

                newNodes.push({
                    id: `${branchId}-sub-${subIndex}`,
                    text: subBranch,
                    x: subX,
                    y: subY,
                    level: 2,
                    parent: branchId
                });
            });
        });

        return newNodes;
    };

    const generateMainBranches = (topic: string): string[] => {
        const topicLower = topic.toLowerCase();
        
        // AI-like logic to generate relevant branches
        if (topicLower.includes('machine learning') || topicLower.includes('ai')) {
            return ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Applications', 'Tools & Frameworks'];
        } else if (topicLower.includes('web development')) {
            return ['Frontend', 'Backend', 'Database', 'DevOps', 'Security'];
        } else if (topicLower.includes('business')) {
            return ['Marketing', 'Finance', 'Operations', 'Strategy', 'Human Resources'];
        } else if (topicLower.includes('health') || topicLower.includes('fitness')) {
            return ['Nutrition', 'Exercise', 'Mental Health', 'Sleep', 'Prevention'];
        } else if (topicLower.includes('education')) {
            return ['Curriculum', 'Teaching Methods', 'Assessment', 'Technology', 'Student Support'];
        } else {
            // Generic branches
            return ['Key Concepts', 'Applications', 'Benefits', 'Challenges', 'Future Trends'];
        }
    };

    const generateSubBranches = (branch: string): string[] => {
        const branchLower = branch.toLowerCase();
        
        // Generate sub-concepts based on branch
        const subBranchMap: { [key: string]: string[] } = {
            'supervised learning': ['Classification', 'Regression', 'Decision Trees'],
            'unsupervised learning': ['Clustering', 'Dimensionality Reduction', 'Association'],
            'neural networks': ['CNN', 'RNN', 'Transformers'],
            'frontend': ['HTML/CSS', 'JavaScript', 'React/Vue'],
            'backend': ['Node.js', 'Python', 'APIs'],
            'database': ['SQL', 'NoSQL', 'Caching'],
            'marketing': ['Digital Marketing', 'Content Strategy', 'SEO'],
            'finance': ['Budgeting', 'Investment', 'Analysis'],
            'nutrition': ['Macronutrients', 'Vitamins', 'Hydration'],
            'exercise': ['Cardio', 'Strength', 'Flexibility'],
        };

        for (const key in subBranchMap) {
            if (branchLower.includes(key)) {
                return subBranchMap[key];
            }
        }

        // Generic sub-branches
        return ['Aspect 1', 'Aspect 2', 'Aspect 3'];
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate AI processing
        setTimeout(() => {
            const generatedNodes = generateConceptMap(topic);
            setNodes(generatedNodes);
            setIsLoading(false);
        }, 1500);
    };

    // Draw concept map on canvas
    useEffect(() => {
        if (nodes.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        nodes.forEach(node => {
            if (node.parent) {
                const parent = nodes.find(n => n.id === node.parent);
                if (parent) {
                    ctx.beginPath();
                    ctx.moveTo(parent.x, parent.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.strokeStyle = node.level === 1 ? '#8b5cf6' : '#a78bfa';
                    ctx.lineWidth = node.level === 1 ? 3 : 2;
                    ctx.stroke();
                }
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            const isSelected = selectedNode === node.id;
            const radius = node.level === 0 ? 60 : node.level === 1 ? 50 : 40;
            
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            
            // Gradient fill
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
            if (node.level === 0) {
                gradient.addColorStop(0, '#a855f7');
                gradient.addColorStop(1, '#7c3aed');
            } else if (node.level === 1) {
                gradient.addColorStop(0, '#8b5cf6');
                gradient.addColorStop(1, '#6d28d9');
            } else {
                gradient.addColorStop(0, '#a78bfa');
                gradient.addColorStop(1, '#8b5cf6');
            }
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Border
            ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
            ctx.lineWidth = isSelected ? 4 : 2;
            ctx.stroke();

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = `${node.level === 0 ? 'bold 16px' : node.level === 1 ? 'bold 14px' : '12px'} Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Wrap text
            const words = node.text.split(' ');
            const maxWidth = radius * 1.6;
            let line = '';
            let y = node.y;
            
            if (words.length > 2) {
                y = node.y - 8;
            }
            
            words.forEach((word, index) => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && line !== '') {
                    ctx.fillText(line.trim(), node.x, y);
                    line = word + ' ';
                    y += 16;
                } else {
                    line = testLine;
                }
                
                if (index === words.length - 1) {
                    ctx.fillText(line.trim(), node.x, y);
                }
            });
        });
    }, [nodes, selectedNode]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked on a node
        for (const node of nodes) {
            const radius = node.level === 0 ? 60 : node.level === 1 ? 50 : 40;
            const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            
            if (distance <= radius) {
                setSelectedNode(node.id === selectedNode ? null : node.id);
                return;
            }
        }
        
        setSelectedNode(null);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `concept-map-${topic.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const handleReset = () => {
        setNodes([]);
        setTopic('');
        setSelectedNode(null);
        setError('');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Visually connect ideas branching from a central topic</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {nodes.length === 0 ? (
                    <div className="space-y-6">
                        {/* Topic Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Enter Your Topic
                            </label>
                            <input 
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="e.g., Machine Learning, Web Development, Business Strategy..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-lg"
                            />
                        </div>

                        {/* Examples */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                            <p className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Example Topics:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Machine Learning', 'Web Development', 'Business Strategy', 'Health & Fitness', 'Education'].map((example) => (
                                    <button
                                        key={example}
                                        onClick={() => setTopic(example)}
                                        className="px-3 py-1 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-lg text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        {isLoading ? (
                            <div className="min-h-[200px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <button 
                                onClick={handleGenerate}
                                disabled={!topic.trim()}
                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Generate Concept Map</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Canvas */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={600}
                                onClick={handleCanvasClick}
                                className="w-full cursor-pointer rounded-lg"
                            />
                        </div>

                        {/* Info */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-purple-700 dark:text-purple-300">
                                    <p className="font-semibold mb-1">Interactive Features:</p>
                                    <ul className="list-disc list-inside space-y-1 text-purple-600 dark:text-purple-400">
                                        <li>Click on nodes to highlight them</li>
                                        <li>Central topic in the middle with main branches</li>
                                        <li>Sub-concepts connected to main branches</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button 
                                onClick={handleDownload}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download as Image</span>
                            </button>
                            <button 
                                onClick={handleReset}
                                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>New Topic</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-slide-up max-w-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
