
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const jspdf: any;

const template = `SERVICE AGREEMENT

This Service Agreement (the "Agreement") is made and entered into on {date} (the "Effective Date") by and between:

{provider} (the "Service Provider")
and
{client} (the "Client").

1. SCOPE OF WORK
The Service Provider agrees to perform the following services for the Client:
{scope}

2. PAYMENT
The Client agrees to pay the Service Provider the total amount of {payment} for the services rendered. Payment shall be due upon completion of the services.

3. TERM
This Agreement will commence on the Effective Date and will remain in effect until the services are completed, unless terminated earlier by either party with 30 days written notice.

4. CONFIDENTIALITY
The Service Provider agrees to keep all client information confidential.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service Provider operates.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.


_________________________
(Service Provider Signature)


_________________________
(Client Signature)
`;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="stamp-loader mx-auto">
            <div className="stamp-handle"></div>
            <div className="stamp-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating Legal Document...</p>
        <style>{`
            .stamp-loader { width: 80px; height: 100px; position: relative; }
            .stamp-handle { width: 60px; height: 30px; background: #64748b; border-radius: 15px 15px 0 0; position: absolute; top: 0; left: 10px; }
            .stamp-base { width: 100%; height: 50px; background: #9ca3af; border-radius: 8px; position: absolute; top: 30px; animation: stamp-anim 1.5s infinite ease-in-out; }
            .dark .stamp-handle { background: #94a3b8; }
            .dark .stamp-base { background: #cbd5e1; }
            @keyframes stamp-anim { 0%,100% {transform:translateY(0)} 50% {transform:translateY(20px) scaleY(0.9)} }
        `}</style>
    </div>
);

export const AgreementContractGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [provider, setProvider] = useState('Your Company Inc.');
    const [client, setClient] = useState('Client Company LLC');
    const [scope, setScope] = useState('- Initial website design mockups\n- Development of a 5-page static website\n- One round of revisions');
    const [payment, setPayment] = useState('₹50,000');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = () => {
        setIsLoading(true);
        setError(null);
        try {
            setTimeout(() => {
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
                setIsLoading(false);
            }, 1500);
        } catch (e) {
            setError("Failed to generate PDF. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a simple service agreement from a template.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> : (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={provider} onChange={e => setProvider(e.target.value)} placeholder="Service Provider" className="input-style w-full"/>
                                <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client" className="input-style w-full"/>
                            </div>
                            <textarea value={scope} onChange={e => setScope(e.target.value)} rows={4} placeholder="Scope of Work (use '-' for bullet points)" className="input-style w-full"/>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={payment} onChange={e => setPayment(e.target.value)} placeholder="Payment Amount" className="input-style w-full"/>
                                <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" className="input-style w-full"/>
                             </div>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate PDF Contract</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
            `}</style>
        </>
    );
};
