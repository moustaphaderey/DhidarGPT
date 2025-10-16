import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Page } from '../types';
import { startChat, getChatResponse } from '../services/geminiService';
import { LoadingSpinner } from './common/LoadingSpinner';

interface ChatPageProps {
  setPage: (page: Page) => void;
}

const geminiModels = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
];

export const ChatPage: React.FC<ChatPageProps> = ({ setPage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Bonjour ! Je suis DhidarGPT, votre assistant IA. Comment puis-je vous aider aujourd'hui ?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(geminiModels[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startChat(selectedModel, messages.slice(0, -1)); // Initialize chat without the greeting
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await getChatResponse(input);
    
    const botMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    setMessages([
        { role: 'model', parts: [{ text: "Bonjour ! Je suis DhidarGPT, votre assistant IA. Comment puis-je vous aider aujourd'hui ?" }] }
    ]);
  }

  return (
    <div className="container mx-auto max-w-3xl h-[90vh] md:h-[85vh] flex flex-col p-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col flex-grow w-full animate-fadeIn">
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <button onClick={() => setPage('home')} className="px-4 py-2 text-sm font-semibold rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors">
            🏠 Retour à l'accueil
          </button>
          <h2 className="text-xl font-bold text-white">DhidarGPT Chat</h2>
          <select 
            value={selectedModel}
            onChange={handleModelChange}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors appearance-none cursor-pointer"
          >
            {geminiModels.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
          </select>
        </header>

        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-gray-700/50 text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-lg px-4 py-3 rounded-2xl bg-gray-700/50 text-gray-200 flex items-center space-x-2">
                 <LoadingSpinner />
                 <span>Réflexion...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-4 bg-gray-800/50 rounded-full p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Demandez n'importe quoi..."
              className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-4"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-500 hover:to-purple-500 transition-all"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};