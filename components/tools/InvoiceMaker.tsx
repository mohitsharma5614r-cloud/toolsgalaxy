import React, { useState, useMemo } from 'react';
// @ts-ignore
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Toast } from '../Toast';

interface LineItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="receipt-loader mx-auto">
            <div className="receipt-paper"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your invoice...</p>
        <style>{`
            .receipt-loader { width: 80px; height: 100px; background: #9ca3af; border-radius: 8px 8px 0 0; position: relative; overflow: hidden; }
            .dark .receipt-loader { background: #475569; }
            .receipt-paper { width: 90%; background: #f1f5f9; position: absolute; top: 10px; left: 5%; animation: print-receipt 2s forwards; }
            .dark .receipt-paper { background: #1e293b; }
            @keyframes print-receipt { 0% { height: 0; } 100% { height: 120%; } }
        `}</style>
    </div>
);

export const InvoiceMaker: React.FC<{ title: string }> = ({ title }) => {
    const [from, setFrom] = useState('Your Company Inc.\n123 Business Rd\nCommerce City, 12345');
    const [to, setTo] = useState('Client Company LLC\n456 Client Ave\nClientville, 54321');
    const [invoiceNum, setInvoiceNum] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<LineItem[]>([{ id: 1, description: 'Website Development', quantity: 40, rate: 1500 }]);
    const [taxRate, setTaxRate] = useState(18);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { subtotal, taxAmount, total } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
        const tax = sub * (taxRate / 100);
        return { subtotal: sub, taxAmount: tax, total: sub + tax };
    }, [items, taxRate]);

    const addItem = () => setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0 }]);
    const removeItem = (id: number) => setItems(items.filter(item => item.id !== id));
    const updateItem = (id: number, field: keyof Omit<LineItem, 'id'>, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleGenerate = () => {
        setIsLoading(true);
        setError(null);
        try {
            setTimeout(() => {
                // @ts-ignore
                const doc = new jsPDF();
                
                doc.setFontSize(22).setFont('helvetica', 'bold').text('INVOICE', 14, 22);
                doc.setFontSize(10).setFont('helvetica', 'normal');
                doc.text(from.split('\n'), 14, 40);
                doc.text(`Invoice #: ${invoiceNum}`, 140, 40);
                doc.text(`Date: ${date}`, 140, 48);
                
                doc.setFontSize(12).setFont('helvetica', 'bold').text('Bill To:', 14, 100);
                doc.setFontSize(10).setFont('helvetica', 'normal').text(to.split('\n'), 14, 110);
                
                const tableData = items.map(item => [item.description, item.quantity, `₹${item.rate}`, `₹${(item.quantity * item.rate).toLocaleString()}`]);
                // @ts-ignore
                doc.autoTable({
                    head: [['Description', 'Quantity', 'Rate', 'Amount']],
                    body: tableData,
                    startY: 150,
                    headStyles: { fillColor: [30, 41, 59] },
                    alternateRowStyles: { fillColor: [241, 245, 249] },
                });

                const finalY = doc.autoTable.previous.finalY;
                doc.setFontSize(10).text('Subtotal:', 140, finalY + 15);
                doc.text(`₹${subtotal.toLocaleString()}`, 200, finalY + 15, { align: 'right' });
                doc.text(`Tax (${taxRate}%):`, 140, finalY + 25);
                doc.text(`₹${taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 200, finalY + 25, { align: 'right' });
                doc.setFontSize(12).setFont('helvetica', 'bold');
                doc.text('Total:', 140, finalY + 35);
                doc.text(`₹${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 200, finalY + 35, { align: 'right' });
                
                doc.save(`invoice-${invoiceNum}.pdf`);
                setIsLoading(false);
            }, 1000);
        } catch (e) {
            setError("Failed to generate PDF.");
            setIsLoading(false);
        }
    };

    return (
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create professional invoices to bill your clients.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                {isLoading && <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>}
                {!isLoading && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <textarea value={from} onChange={e => setFrom(e.target.value)} rows={3} placeholder="From..." className="input-style"/>
                            <textarea value={to} onChange={e => setTo(e.target.value)} rows={3} placeholder="To..." className="input-style"/>
                            <input value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} placeholder="Invoice #" className="input-style"/>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-style"/>
                        </div>
                        <div className="space-y-2 pt-4">
                            <div className="grid grid-cols-[1fr,80px,100px,30px] gap-2 items-center text-sm font-bold">
                                <span>Description</span>
                                <span className="text-center">Qty</span>
                                <span className="text-center">Rate</span>
                                <span></span>
                            </div>
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-[1fr,80px,100px,30px] gap-2 items-center">
                                    <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Item" className="input-style text-sm" />
                                    <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} className="input-style text-center text-sm"/>
                                    <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="input-style text-right text-sm"/>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold text-lg text-center">✕</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addItem} className="text-sm btn-secondary">+ Add Line Item</button>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t items-center">
                            <div><label>Tax Rate (%):</label><input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="input-style w-full"/></div>
                            <div className="text-right"><strong>Subtotal:</strong> ₹{subtotal.toLocaleString()}</div>
                            <div className="text-right text-xl"><strong>Total:</strong> ₹{total.toLocaleString()}</div>
                        </div>
                        <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF Invoice</button>
                    </>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                 .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1rem; }
            `}</style>
        </div>
    );
};