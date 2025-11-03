// @ts-nocheck
import React, { useState, useMemo } from 'react';

declare const jspdf: any;

interface LineItem {
    description: string;
    quantity: number;
    rate: number;
}

export const InvoiceToPdfGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [from, setFrom] = useState('Your Company\n123 Your Street\nYour City, 12345');
    const [to, setTo] = useState('Client Company\n456 Client Avenue\nClient City, 54321');
    const [invoiceNum, setInvoiceNum] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<LineItem[]>([{ description: 'Web Development Services', quantity: 10, rate: 150 }]);
    const [taxRate, setTaxRate] = useState(18);

    const { subtotal, taxAmount, total } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const tax = sub * (taxRate / 100);
        return { subtotal: sub, taxAmount: tax, total: sub + tax };
    }, [items, taxRate]);
    
    const handleGenerate = () => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20).setFont('helvetica', 'bold').text('INVOICE', 14, 22);
        doc.setFontSize(10).setFont('helvetica', 'normal');
        doc.text(from.split('\n'), 14, 40);
        doc.text(`Invoice #: ${invoiceNum}`, 140, 40);
        doc.text(`Date: ${date}`, 140, 48);
        
        // Bill To
        doc.setFontSize(12).setFont('helvetica', 'bold').text('Bill To:', 14, 100);
        doc.setFontSize(10).setFont('helvetica', 'normal').text(to.split('\n'), 14, 110);
        
        // Table
        const tableData = items.map(item => [item.description, item.quantity, `₹${item.rate}`, `₹${(item.quantity * item.rate).toFixed(2)}`]);
        doc.autoTable({
            head: [['Description', 'Quantity', 'Rate', 'Amount']],
            body: tableData,
            startY: 150,
            headStyles: { fillColor: [30, 41, 59] },
        });

        // Totals
        const finalY = doc.autoTable.previous.finalY;
        doc.setFontSize(10).text('Subtotal:', 140, finalY + 15);
        doc.text(`₹${subtotal.toFixed(2)}`, 200, finalY + 15, { align: 'right' });
        doc.text(`Tax (${taxRate}%):`, 140, finalY + 25);
        doc.text(`₹${taxAmount.toFixed(2)}`, 200, finalY + 25, { align: 'right' });
        doc.setFontSize(12).setFont('helvetica', 'bold');
        doc.text('Total:', 140, finalY + 35);
        doc.text(`₹${total.toFixed(2)}`, 200, finalY + 35, { align: 'right' });
        
        doc.save(`invoice-${invoiceNum}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create and download professional PDF invoices from a template.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <textarea value={from} onChange={e => setFrom(e.target.value)} rows={3} placeholder="From..." className="input-style"/>
                    <textarea value={to} onChange={e => setTo(e.target.value)} rows={3} placeholder="To..." className="input-style"/>
                    <input value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} placeholder="Invoice #" className="input-style"/>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-style"/>
                </div>
                 {/* Line items could be a more complex component here */}
                <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF Invoice</button>
            </div>
        </div>
    );
};
