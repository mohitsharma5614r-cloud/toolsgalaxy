
import React, { useState, useMemo } from 'react';

interface Payment {
  id: number;
  vendor: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const VendorPaymentScheduleTool: React.FC<{ title: string }> = ({ title }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    const addPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (vendor.trim() && amount && dueDate) {
            const newPayment: Payment = {
                id: Date.now(),
                vendor,
                amount: Number(amount),
                dueDate,
                paid: false,
            };
            setPayments([...payments, newPayment]);
            setVendor('');
            setAmount('');
            setDueDate('');
        }
    };
    
    const togglePaid = (id: number) => {
        setPayments(payments.map(p => p.id === id ? { ...p, paid: !p.paid } : p));
    };

    const deletePayment = (id: number) => {
        setPayments(payments.filter(p => p.id !== id));
    };

    const sortedPayments = useMemo(() => {
        return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [payments]);
    
    const totalDue = useMemo(() => {
        return payments.filter(p => !p.paid).reduce((sum, p) => sum + p.amount, 0);
    }, [payments]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a schedule for paying your vendors on time.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Add Payment</h2>
                    <form onSubmit={addPayment} className="space-y-3">
                        <input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Vendor Name" className="input-style w-full" required/>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (₹)" className="input-style w-full" required/>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-style w-full" required/>
                        <button type="submit" className="btn-primary w-full">Add to Schedule</button>
                    </form>
                </div>

                <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Payment Schedule</h2>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Total Due</p>
                            <p className="font-bold text-lg text-red-500">₹{totalDue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sortedPayments.length > 0 ? sortedPayments.map(p => (
                            <div key={p.id} className={`p-3 rounded-lg flex items-center gap-4 transition-colors ${p.paid ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                <input type="checkbox" checked={p.paid} onChange={() => togglePaid(p.id)} className="h-5 w-5 rounded"/>
                                <div className="flex-grow">
                                    <p className={`font-semibold ${p.paid ? 'line-through text-slate-400' : ''}`}>{p.vendor}</p>
                                    <p className={`text-sm ${p.paid ? 'line-through text-slate-400' : 'text-slate-500'}`}>
                                        Due: {formatDate(p.dueDate)}
                                    </p>
                                </div>
                                <p className={`font-bold text-lg ${p.paid ? 'line-through text-slate-400' : ''}`}>₹{p.amount.toLocaleString()}</p>
                                <button onClick={() => deletePayment(p.id)} className="text-red-500 font-bold">&times;</button>
                            </div>
                        )) : <p className="text-slate-400 text-center py-8">No payments scheduled.</p>}
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
            `}</style>
        </div>
    );
};
