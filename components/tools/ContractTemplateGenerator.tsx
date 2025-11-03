
// @ts-nocheck
import React, { useState } from 'react';
declare const jspdf: any;

const template = `SERVICE AGREEMENT

This Service Agreement (the "Agreement") is made and entered into on {date} (the "Effective Date") by and between:

{provider} (the "Service Provider") and {client} (the "Client").

1. SCOPE OF WORK
The Service Provider agrees to perform the following services for the Client:
{scope}

2. PAYMENT
The Client agrees to pay the Service Provider the total amount of {payment} for the services rendered.

3. TERM
This Agreement will commence on the Effective Date and will remain in effect until the services are completed.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

_________________________
Service Provider

_________________________
Client`;

export const ContractTemplateGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [provider, setProvider] = useState('Your Name / Company');
    const [client, setClient] = useState('Client Name');
    const [scope, setScope] = useState('- Initial website design mockups\n- Development of a 5-page static website\n- One round of revisions');
    const [payment, setPayment] = useState('₹50,000');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

    const handleGenerate = () => {
        const filledContract = template
            .replace('{date}', date)
            .replace('{provider}', provider)
            .replace('{client}', client)
            .replace('{scope}', scope)
            .replace('{payment}', payment);
            
        const { jsPDF } = jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 60;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(11).setFont('times', 'normal');
        const lines = doc.splitTextToSize(filledContract, pageWidth - 2 * margin);
        doc.text(lines, margin, margin);
        
        doc.save('service-agreement.pdf');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate simple service agreements from a template.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <input value={provider} onChange={e => setProvider(e.target.value)} placeholder="Service Provider" className="input-style w-full"/>
                <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client" className="input-style w-full"/>
                <textarea value={scope} onChange={e => setScope(e.target.value)} rows={4} placeholder="Scope of Work" className="input-style w-full"/>
                <input value={payment} onChange={e => setPayment(e.target.value)} placeholder="Payment Amount" className="input-style w-full"/>
                <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" className="input-style w-full"/>
                <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF Contract</button>
            </div>
        </div>
    );
};
