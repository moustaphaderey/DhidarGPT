import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { SummarizePage } from './components/SummarizePage';
import { ImageGenerationPage } from './components/ImageGenerationPage';
import type { Page } from './types';

function App() {
  const [page, setPage] = useState<Page>('home');

  const renderPage = () => {
    switch (page) {
      case 'chat':
        return <ChatPage setPage={setPage} />;
      case 'summarize':
        return <SummarizePage setPage={setPage} />;
      case 'image':
        return <ImageGenerationPage setPage={setPage} />;
      case 'home':
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
