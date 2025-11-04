import React, { useEffect, useState } from 'react';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import { LogoIcon } from './components/icons';
import { useMessageHandler } from './hooks/useMessageHandler';
import { useApiStore } from './store/useApiStore';
import { vscode } from './vscode';

const App: React.FC = () => {
  useMessageHandler(); // Initialize message listener
  const [hasApiKey, setHasApiKey] = useState(true); // Assume true initially
  const apiKeyChecked = useApiStore(state => state.apiKeyChecked);
  const setApiKeyChecked = useApiStore(state => state.setApiKeyChecked);
  const setHasApiKeyStore = useApiStore(state => state.setHasApiKey);


  useEffect(() => {
    if(!apiKeyChecked){
      vscode.postMessage({ command: 'checkApiKey' });
      setApiKeyChecked(true); // Prevent re-checking
    }
  }, [apiKeyChecked, setApiKeyChecked]);

  useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
          const message = event.data;
          if (message.command === 'apiKeyStatus') {
              setHasApiKey(message.payload.hasApiKey);
              setHasApiKeyStore(message.payload.hasApiKey);
          }
          if (message.command === 'apiKeySet') {
              setHasApiKey(true);
              setHasApiKeyStore(true);
          }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, [setHasApiKeyStore]);


  if (!hasApiKey) {
    return (
      <div className="bg-gem-bg text-gem-text min-h-screen flex flex-col items-center justify-center p-4">
        <LogoIcon className="w-16 h-16 mb-4 text-gem-accent" />
        <h1 className="text-2xl font-bold mb-2">Welcome to ServerGem</h1>
        <p className="text-gem-text-secondary mb-6">Please set your Gemini API key to get started.</p>
        <button
          onClick={() => vscode.postMessage({ command: 'openApiKeyPanel' })}
          className="bg-gem-accent text-white font-bold py-2 px-4 rounded-md hover:bg-gem-accent-hover"
        >
          Set API Key
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gem-bg text-gem-text min-h-screen font-sans flex flex-col">
      <header className="flex items-center p-2 border-b border-gem-border bg-gem-panel flex-shrink-0">
        <LogoIcon className="w-8 h-8 mr-2 text-gem-accent" />
        <h1 className="text-xl font-semibold">ServerGem</h1>
        <span className="text-sm text-gem-text-secondary ml-2 mt-1">Your Backend Copilot</span>
      </header>
      <main className="flex-grow flex flex-col lg:flex-row p-2 gap-2 overflow-hidden">
        <div className="lg:w-1/2 flex flex-col min-h-0">
          <RequestPanel />
        </div>
        <div className="lg:w-1/2 flex flex-col min-h-0">
          <ResponsePanel />
        </div>
      </main>
    </div>
  );
};

export default App;
