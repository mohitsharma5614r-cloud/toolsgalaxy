import React, { useState } from 'react';

const canvasSections = [
    { id: 'keyPartners', title: 'Key Partners', gridArea: '1 / 1 / 2 / 2' },
    { id: 'keyActivities', title: 'Key Activities', gridArea: '1 / 2 / 2 / 3' },
    { id: 'valuePropositions', title: 'Value Propositions', gridArea: '1 / 3 / 3 / 4' },
    { id: 'customerRelationships', title: 'Customer Relationships', gridArea: '1 / 4 / 2 / 5' },
    { id: 'customerSegments', title: 'Customer Segments', gridArea: '1 / 5 / 2 / 6' },
    { id: 'keyResources', title: 'Key Resources', gridArea: '2 / 2 / 3 / 3' },
    { id: 'channels', title: 'Channels', gridArea: '2 / 4 / 3 / 5' },
    { id: 'costStructure', title: 'Cost Structure', gridArea: '3 / 1 / 4 / 4' },
    { id: 'revenueStreams', title: 'Revenue Streams', gridArea: '3 / 4 / 4 / 6' },
];

type CanvasData = Record<string, string[]>;

const CanvasSection: React.FC<{
    title: string;
    items: string[];
    onAddItem: () => void;
    onDeleteItem: (index: number) => void;
    onUpdateItem: (index: number, text: string) => void;
}> = ({ title, items, onAddItem, onDeleteItem, onUpdateItem }) => (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full">
        <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
        <div className="space-y-2 flex-grow overflow-y-auto">
            {items.map((item, index) => (
                <div key={index} className="relative group">
                    <textarea 
                        value={item}
                        onChange={(e) => onUpdateItem(index, e.target.value)}
                        className="w-full text-xs bg-yellow-100 dark:bg-yellow-200 text-yellow-900 p-2 rounded-sm shadow-sm resize-none" 
                        rows={3}
                    />
                     <button onClick={() => onDeleteItem(index)} className="absolute top-1 right-1 text-red-500 text-xs opacity-0 group-hover:opacity-100">✕</button>
                </div>
            ))}
        </div>
        <button onClick={onAddItem} className="mt-2 w-full text-center text-xs bg-slate-200 dark:bg-slate-700 rounded p-1 hover:bg-slate-300">+</button>
    </div>
);

export const BusinessModelBuilder: React.FC<{ title: string }> = ({ title }) => {
    const [data, setData] = useState<CanvasData>({
        valuePropositions: ['Easy-to-use project management tool'],
        customerSegments: ['Small businesses and freelancers'],
    });

    const handleUpdate = (sectionId: string, index: number, text: string) => {
        const newItems = [...(data[sectionId] || [])];
        newItems[index] = text;
        setData({ ...data, [sectionId]: newItems });
    };
    
    const handleAdd = (sectionId: string) => {
        setData({ ...data, [sectionId]: [...(data[sectionId] || []), 'New Note'] });
    };
    
    const handleDelete = (sectionId: string, index: number) => {
        setData({ ...data, [sectionId]: (data[sectionId] || []).filter((_, i) => i !== index) });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <style>{`
                .bmc-grid { display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(3, 1fr); gap: 1rem; height: 80vh; }
                .animate-draw-in > div { animation: draw-in 0.5s ease-out forwards; opacity: 0; }
                @keyframes draw-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Build a Business Model Canvas for your idea.</p>
            </div>
            <div className="bmc-grid animate-draw-in">
                {canvasSections.map((section, index) => (
                    <div key={section.id} style={{ gridArea: section.gridArea, animationDelay: `${index * 50}ms` }}>
                        <CanvasSection
                            title={section.title}
                            items={data[section.id] || []}
                            onAddItem={() => handleAdd(section.id)}
                            onDeleteItem={(itemIndex) => handleDelete(section.id, itemIndex)}
                            onUpdateItem={(itemIndex, text) => handleUpdate(section.id, itemIndex, text)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
