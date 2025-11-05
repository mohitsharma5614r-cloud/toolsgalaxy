
import React, { useState } from 'react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here.
    // For this demo, we'll just show a success message.
    if(name && email && message) {
        setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-slate-900 dark:text-white">Contact Us</h1>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10">We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Info */}
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">Get in Touch</h2>
            <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:contact@toolsgalaxy.com" className="text-indigo-500 hover:underline">contact@toolsgalaxy.com</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-slate-500 dark:text-slate-400">123 Starship Lane, Orion Nebula</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-1.144.465-2.166 1.228-2.933zM6.5 21v-2a4 4 0 014-4h3a4 4 0 014 4v2" /></svg>
                <div>
                    <h3 className="font-semibold">Social Media</h3>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-slate-500 hover:text-indigo-500">Twitter</a>
                        <a href="#" className="text-slate-500 hover:text-indigo-500">GitHub</a>
                        <a href="#" className="text-slate-500 hover:text-indigo-500">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Form */}
        <div>
            {submitted ? (
                 <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-700/50 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="text-xl font-bold mt-4">Thank You!</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Your message has been received. We'll get back to you shortly.</p>
                     <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-indigo-500 font-semibold">Send Another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 input-style" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 input-style" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Message</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="mt-1 input-style"></textarea>
                    </div>
                    <button type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md">
                        Send Message
                    </button>
                </form>
            )}
        </div>
      </div>
       <style>{`
            .input-style {
                width: 100%;
                padding: 0.75rem;
                border-radius: 0.5rem;
                border: 1px solid #cbd5e1; /* slate-300 */
                background-color: #f1f5f9; /* slate-100 */
            }
            .dark .input-style {
                background-color: #1e293b; /* slate-800 */
                border-color: #475569; /* slate-600 */
                color: white;
            }
       `}</style>
    </div>
  );
};
