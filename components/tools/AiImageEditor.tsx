
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { EditPanel } from '../EditPanel';
import { ResultDisplay } from '../ResultDisplay';
import { editImageWithPrompt } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Loader } from '../Loader';
import { Toast } from '../Toast';

// FIX: Corrected component to accept and use the title prop passed from App.tsx.
export const AiImageEditor: React.FC<{ title: string }> = ({ title }) => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setEditedImage(null);
    setError(null);
  };
  
  const handleGenerate = useCallback(async (prompt: string) => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a text prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImage);
      const generatedImageBase64 = await editImageWithPrompt(base64, mimeType, prompt);
      
      if (generatedImageBase64) {
        setEditedImage(`data:image/png;base64,${generatedImageBase64}`);
      } else {
        throw new Error("The API did not return an image. Please try a different prompt.");
      }
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);
  
  const clearError = () => setError(null);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            {/* FIX: Use the `title` prop for the heading. */}
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Edit images simply by describing the changes you want to see.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col space-y-8">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Upload Your Image</h2>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
              {originalImage && (
                  <div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Describe Your Edit</h2>
                    <EditPanel onGenerate={handleGenerate} isLoading={isLoading} />
                  </div>
              )}
            </div>
            <div className="flex flex-col space-y-8">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">3. View Result</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                    <Loader />
                    ) : editedImage ? (
                    <ResultDisplay editedImageUrl={editedImage} />
                    ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <p className="mt-4 text-lg">Your edited image will appear here.</p>
                    </div>
                    )}
                </div>
              </div>
            </div>
        </div>
      </div>
      {error && <Toast message={error} onClose={clearError} />}
    </>
  );
};
