import React from 'react';
import { Page } from '../types';
import { RobotIcon } from './icons/RobotIcon';
import { SummarizeIcon } from './icons/SummarizeIcon';
import { ImageIcon } from './icons/ImageIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';

interface HomePageProps {
  setPage: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  return (
    <div className="container mx-auto max-w-4xl p-4 animate-fadeIn">
      <header className="text-center my-8 md:my-12">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Dhidar<span className="text-pink-500">GPT</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Votre suite d'outils IA optimisée par Google Gemini.
        </p>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <FeatureCard
          icon={<RobotIcon className="w-10 h-10 mb-4" />}
          title="Chat IA"
          description="Discutez avec un assistant IA avancé pour obtenir des réponses, des idées, et plus encore."
          onClick={() => setPage('chat')}
        />
        <FeatureCard
          icon={<SummarizeIcon className="w-10 h-10 mb-4" />}
          title="Résumé de Texte"
          description="Obtenez des résumés concis de longs documents, articles ou textes."
          onClick={() => setPage('summarize')}
        />
        <FeatureCard
          icon={<ImageIcon className="w-10 h-10 mb-4" />}
          title="Génération d'Image"
          description="Créez des images uniques et de haute qualité à partir de simples descriptions textuelles."
          onClick={() => setPage('image')}
        />
      </main>

      <footer className="text-center mt-12 text-gray-500">
        <p className="mb-2">Développé par MoustaphaDereyCODE</p>
        <a 
          href="https://wa.me/25377605033" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
        >
          <WhatsappIcon className="w-5 h-5" />
          <span>Contactez-moi sur WhatsApp</span>
        </a>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center text-white cursor-pointer hover:bg-white/10 hover:border-white/20 transform hover:-translate-y-2 transition-all duration-300"
    >
      {icon}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};