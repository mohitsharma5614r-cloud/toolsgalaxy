import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 my-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">About ToolsGalaxy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-center">Your One-Stop Hub for Free, Secure, and Powerful Online Tools.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-2">Our Mission</h2>
        <p>At ToolsGalaxy, our mission is simple: to provide a comprehensive suite of high-quality, easy-to-use online tools that are accessible to everyone, for free. We believe that productivity and creativity shouldn't be locked behind expensive software or complicated installations. Whether you're a student, a professional, a creator, or just someone looking to get a task done quickly, ToolsGalaxy is here for you.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">What We Offer</h2>
        <p>We offer a vast and ever-growing collection of tools across various categories, including:</p>
        <ul>
          <li><strong>Document Tools:</strong> Merge, split, compress, convert, and edit PDFs and other documents with ease.</li>
          <li><strong>Image Utilities:</strong> From simple conversions and compression to AI-powered editing, we've got your imaging needs covered.</li>
          <li><strong>AI-Powered Creativity:</strong> Generate articles, create presentations, design thumbnails, and explore fun, creative tools powered by cutting-edge AI.</li>
          <li><strong>Calculators & Converters:</strong> A wide range of utility tools for finance, science, and everyday calculations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Commitment to Your Privacy</h2>
        <p>In an age where data privacy is paramount, we've built ToolsGalaxy with a "privacy-first" approach. The majority of our tools operate entirely on your device, within your browser. This means:</p>
        <p><strong>Your files and data never leave your computer.</strong></p>
        <p>For tools that don't require advanced AI processing, there's no uploading to servers. This client-side approach ensures your work remains private and secure.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Powered by Advanced AI</h2>
        <p>For our advanced artificial intelligence features, like the AI Image Editor and various content generators, we utilize powerful and efficient AI models. This allows us to bring you state-of-the-art capabilities while maintaining our commitment to not storing your data on our own servers. All data sent for AI processing is handled according to the privacy policies of our technology partners.</p>

        <p className="mt-8">Thank you for visiting ToolsGalaxy. We're constantly working to add new tools and improve existing ones. We hope you find our galaxy of tools useful!</p>
      </div>
    </div>
  );
};