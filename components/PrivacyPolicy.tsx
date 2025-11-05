import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy for ToolsGalaxy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p><strong>Last Updated:</strong> October 26, 2023</p>
        
        <p>Welcome to ToolsGalaxy! We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our suite of online tools.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p>For most of our tools, we do not collect, store, or transmit any of your personal data or the content you process. All processing happens directly in your browser (client-side).</p>
        <ul>
          <li><strong>Local Processing:</strong> Tools like document converters, image editors (excluding AI features), calculators, and text utilities operate entirely within your browser. The files and data you use are never sent to our servers.</li>
          <li><strong>AI-Powered Tools:</strong> For tools that require artificial intelligence (e.g., AI Image Editor, AI Article Writer), the data you provide (such as text prompts or images) is sent to our third-party AI service provider's servers for processing. We do not store this data. We encourage you to review the privacy policies of our technology partners for information on how they handle data.</li>
          <li><strong>Microphone Access:</strong> Tools like the Voice Recorder require access to your microphone. Audio data is captured and processed in your browser. You can save the recording to your own device. We do not store your recordings.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
        <p>Since we do not collect personal information for most tools, we do not use it for any purpose. For AI tools, the data is used solely to provide the requested service and is governed by the terms of our AI technology partners.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Cookies and Tracking</h2>
        <p>We do not use tracking cookies. We may use `localStorage` in your browser for essential site preferences, such as remembering your preferred theme (light/dark mode). This information is stored only on your device.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p>We prioritize your security. By processing data client-side for the majority of our tools, we minimize the risk of data breaches as your information never leaves your computer.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Children's Privacy</h2>
        <p>Our services are not directed to children under the age of 13, and we do not knowingly collect any personal information from them.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at contact@toolsgalaxy.com.</p>
      </div>
    </div>
  );
};