import React, { useState } from 'react';

interface Vendor {
    id: number;
    name: string;
    price: number;
    quality: number; // 1-5 scale
    leadTime: number; // in days
}

const Loader: React.FC = () => (
    <div className="scale-loader mx-auto">
        <div className="scale-arm">
            <div className="scale-pan left"></div>
            <div className="scale-pan right"></div>
        </div>
        <div className="scale-base"></div>
    </div>
);

export const VendorComparisonTool: React.FC<{ title: string }> = ({ title }) => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newQuality, setNewQuality] = useState(3);
    const [newLeadTime, setNewLeadTime] = useState('');

    const addVendor = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPrice && newLeadTime) {
            const newVendor: Vendor = {
                id: Date.now(),
                name: newName,
                price: Number(newPrice),
                quality: newQuality,
                leadTime: Number(newLeadTime),
            };
            setVendors([...vendors, newVendor]);
            setNewName(''); setNewPrice(''); setNewLeadTime(''); setNewQuality(3);
        }
    };
    
    const calculateScore = (vendor: Vendor) => {
        // Simple scoring algorithm: lower price and lead time are better, higher quality is better.
        // Normalize values to a common scale to make them comparable.
        const maxPrice = Math.max(...vendors.map(v => v.price), 1);
        const maxLeadTime = Math.max(...vendors.map(v => v.leadTime), 1);
        
        const priceScore = (1 - (vendor.price / maxPrice)) * 40; // Price is 40% weight
        const qualityScore = (vendor.quality / 5) * 40;         // Quality is 40% weight
        const leadTimeScore = (1 - (vendor.leadTime / maxLeadTime)) * 20; // Lead time is 20% weight
        
        return priceScore + qualityScore + leadTimeScore;
    };
    
    const bestVendor = vendors.length > 0 ? vendors.reduce((best, current) => calculateScore(current) > calculateScore(best) ? current : best, vendors[0]) : null;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare quotes and terms from multiple vendors side-by-side.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={addVendor} className="lg:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Add Vendor</h2>
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Vendor Name" className="input-style w-full" required/>
                    <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price (per unit)" className="input-style w-full" required/>
                    <input type="number" value={newLeadTime} onChange={e => setNewLeadTime(e.target.value)} placeholder="Lead Time (days)" className="input-style w-full" required/>
                    <div>
                        <label>Quality (1-5): {newQuality}</label>
                        <input type="range" min="1" max="5" value={newQuality} onChange={e => setNewQuality(Number(e.target.value))} className="w-full" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Add to Comparison</button>
                </form>

                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-bold mb-4">Comparison Table</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-700">
                                    <th className="p-2">Vendor</th><th className="p-2">Price</th><th className="p-2">Quality</th><th className="p-2">Lead Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map(v => (
                                    <tr key={v.id} className={`border-b dark:border-slate-700 ${bestVendor?.id === v.id ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''}`}>
                                        <td className="p-2 font-semibold">{v.name}</td>
                                        <td className="p-2">₹{v.price.toLocaleString()}</td>
                                        <td className="p-2">{v.quality}/5</td>
                                        <td className="p-2">{v.leadTime} days</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {bestVendor && <p className="mt-4 text-center font-bold text-emerald-600">🏆 Best Option: {bestVendor.name}</p>}
                </div>
            </div>
        </div>
    );
};