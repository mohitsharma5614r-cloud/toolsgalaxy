import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Terms & Conditions for ToolsGalaxy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p><strong>Last Updated:</strong> October 26, 2023</p>
        
        <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the ToolsGalaxy website (the "Service").</p>

        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Use of Tools</h2>
        <p>The tools provided on ToolsGalaxy are for your personal and non-commercial use. You agree not to use the tools for any illegal or unauthorized purpose.</p>
        <ul>
          <li><strong>Client-Side Processing:</strong> Most tools on this website process your data entirely within your browser. No data or files are uploaded to our servers for these tools. You are responsible for the data you input.</li>
          <li><strong>AI-Powered Tools:</strong> Certain tools utilize third-party AI services for processing. By using these features, you agree that your input data (text prompts, images) will be sent to these third-party services. We do not store your data. Your use of these AI features is subject to the terms and privacy policies of the respective service providers.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Disclaimers</h2>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>
        <p>ToolsGalaxy does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the results of using the Service will meet your requirements.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Limitation Of Liability</h2>
        <p>In no event shall ToolsGalaxy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
        <p>The Service and its original content, features and functionality are and will remain the exclusive property of ToolsGalaxy and its licensors. The content you create or process using the tools remains your own property.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at contact@toolsgalaxy.com.</p>
      </div>
    </div>
  );
};