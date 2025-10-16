import React, { useState } from 'react';
import type { Page } from '../types';
import { summarizeText } from '../services/geminiService';
import { EXAMPLE_TEXT } from '../constants';
import { LoadingSpinner } from './common/LoadingSpinner';

interface SummarizePageProps {
  setPage: (page: Page) => void;
}

interface SummaryResult {
  summary: string;
  originalLength: number;
  summaryLength: number;

  ratio: number;
}

export const SummarizePage: React.FC<SummarizePageProps> = ({ setPage }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSummarize = async () => {
    setError(null);
    setResult(null);
    if (!inputText.trim()) {
      setError('Veuillez entrer du texte à résumer ou télécharger un fichier.');
      return;
    }
    if (inputText.length < 100) {
      setError('Le texte doit comporter au moins 100 caractères pour un résumé pertinent.');
      return;
    }

    setIsLoading(true);
    const summary = await summarizeText(inputText);
    setIsLoading(false);

    if (summary.startsWith('Désolé')) {
        setError(summary);
    } else {
        setResult({
            summary,
            originalLength: inputText.length,
            summaryLength: summary.length,
            ratio: Math.round((summary.length / inputText.length) * 100),
        });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 animate-fadeIn">
      <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 text-sm font-semibold rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors">
        🏠 Retour à l'accueil
      </button>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-2">📝 Résumé de Texte</h2>
        <p className="text-gray-300 mb-6">Entrez votre texte ci-dessous ou téléchargez un fichier pour obtenir un résumé concis grâce à Gemini.</p>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Entrez votre texte ici pour le résumer..."
          className="w-full min-h-[200px] p-4 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-y"
        />

        <label htmlFor="file-input" className="mt-6 block w-full p-6 border-2 border-dashed border-white/20 rounded-lg text-center text-gray-400 cursor-pointer hover:border-pink-500 hover:bg-pink-500/10 transition-colors">
          📎 Cliquez pour télécharger un fichier texte (.txt, .md)
          <input id="file-input" type="file" accept=".txt,.md" onChange={handleFileChange} className="hidden" />
        </label>
        
        <div className="flex justify-center items-center gap-4 my-6">
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <LoadingSpinner /> : '✨'}
            {isLoading ? 'Résumé en cours...' : 'Résumer'}
          </button>
          <button
            onClick={() => setInputText(EXAMPLE_TEXT)}
            className="px-8 py-3 text-lg font-semibold rounded-full bg-white/10 border border-white/20 text-white shadow-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
          >
            📄 Charger un exemple
          </button>
        </div>

        {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
                <p>{error}</p>
            </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gray-800/50 border border-white/10 rounded-lg animate-fadeIn">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">📋 Résumé :</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mb-4">
                <p><strong>Longueur originale :</strong> {result.originalLength} caractères</p>
                <p><strong>Longueur du résumé :</strong> {result.summaryLength} caractères</p>
                <p><strong>Taux de compression :</strong> {result.ratio}%</p>
            </div>
            <hr className="border-white/10 my-4" />
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
          </div>
        )}

      </div>
    </div>
  );
};