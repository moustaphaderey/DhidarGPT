import React, { useState } from 'react';
import type { Page } from '../types';
import { generateImage } from '../services/geminiService';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ImageIcon } from './icons/ImageIcon';

interface ImageGenerationPageProps {
  setPage: (page: Page) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // result is "data:mime/type;base64,..."
        // We only want the part after the comma
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read blob as base64 string."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const ImageGenerationPage: React.FC<ImageGenerationPageProps> = ({ setPage }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Veuillez sélectionner un fichier image valide.");
        return;
      }
      setError(null);
      setMimeType(file.type);
      setPreviewUrl(URL.createObjectURL(file));
      const base64 = await blobToBase64(file);
      setBase64Image(base64);
    }
  };

  const handleRemoveImage = () => {
    setBase64Image(null);
    setMimeType(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Veuillez entrer une description pour l'image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    const result = await generateImage(prompt, base64Image ?? undefined, mimeType ?? undefined);
    
    setIsLoading(false);

    if (result.startsWith('data:image')) {
      setImageUrl(result);
    } else if (result === "ERROR:SafetyViolation") {
        setError("La génération d'image a été bloquée car le prompt ou l'image enfreint les politiques de sécurité. Veuillez modifier votre demande.");
    } else {
      setError(result);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerateImage();
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 animate-fadeIn">
      <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 text-sm font-semibold rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors">
        🏠 Retour à l'accueil
      </button>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-2">🎨 Génération d'Image</h2>
        <p className="text-gray-300 mb-6">Décrivez l'image que vous souhaitez créer ou modifier, et laissez la magie de l'IA opérer.</p>
        
        {!previewUrl ? (
          <label htmlFor="file-input" className="mb-6 block w-full p-6 border-2 border-dashed border-white/20 rounded-lg text-center text-gray-400 cursor-pointer hover:border-pink-500 hover:bg-pink-500/10 transition-colors">
            📎 Cliquez pour télécharger une image (optionnel)
            <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="mb-6 relative">
            <img src={previewUrl} alt="Aperçu" className="w-full max-h-80 object-contain rounded-lg" />
            <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors">
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 bg-gray-800/50 rounded-full p-2 mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={base64Image ? "Décrivez les modifications à apporter..." : "Ex: Un astronaute surfant sur une vague cosmique..."}
            className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-4"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-2"
          >
            {isLoading ? <LoadingSpinner /> : '✨'}
            {isLoading ? 'Génération...' : 'Générer'}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-6 aspect-square w-full bg-gray-800/50 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-center text-gray-400">
              <LoadingSpinner className="h-10 w-10 mx-auto mb-4 border-4" />
              <p>Création de votre image en cours...</p>
              <p className="text-sm">Cela peut prendre un moment.</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-24 h-24 mx-auto mb-4" />
              <p>Votre image générée apparaîtra ici.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};