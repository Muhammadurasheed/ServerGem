import React from 'react';
import { useApiStore } from '../store/useApiStore';
import AiAnalysis from './AiAnalysis';
import { AiSparkleIcon, LogoIcon } from './icons';

const ResponsePanel: React.FC = () => {
  const response = useApiStore((state) => state.response);
  const error = useApiStore((state) => state.error);
  const loading = useApiStore((state) => state.loading);
  const activeResponseTab = useApiStore((state) => state.activeResponseTab);
  const setActiveResponseTab = useApiStore((state) => state.setActiveResponseTab);
  const hasApiKey = useApiStore((state) => state.hasApiKey);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-gem-text-secondary">
          <div className="w-6 h-6 border-2 border-gem-text-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
          Sending Request...
        </div>
      );
    }

    if (!response && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gem-text-secondary text-center p-4">
          <LogoIcon className="w-12 h-12 mb-4 text-gem-text-secondary" />
          <h2 className="text-lg font-semibold text-gem-text">Welcome to ServerGem</h2>
          <p>Send a request to see the response here.</p>
        </div>
      );
    }
    
    const displayData = response?.data;
    const isError = !!error;
    const status = response?.status || 0;

    const tabs = [
        { name: 'Body', id: 'body' as const },
        { name: 'Headers', id: 'headers' as const },
        { name: 'AI Analysis', id: 'ai' as const, isErrorTab: true },
    ];
    
    return (
      <div className="flex flex-col h-full">
        <div className="p-2 flex items-center justify-between border-b border-gem-border flex-wrap flex-shrink-0">
            <div className="flex items-center space-x-4">
               <span className={`font-bold ${status >= 400 ? 'text-gem-red' : status >= 200 && status < 300 ? 'text-gem-green' : 'text-gem-orange'}`}>
                Status: {status} {response?.statusText}
               </span>
               {response?.time != null && <span className="text-gem-text-secondary">Time: {response.time}ms</span>}
            </div>
        </div>
        <div className="border-b border-gem-border flex-shrink-0">
          <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
            {tabs.map((tab) => (
               (!tab.isErrorTab || (isError && hasApiKey)) && (
                <button
                  key={tab.name}
                  onClick={() => setActiveResponseTab(tab.id)}
                  className={`${
                    activeResponseTab === tab.id
                      ? 'border-gem-accent text-gem-accent'
                      : 'border-transparent text-gem-text-secondary hover:text-gem-text hover:border-gem-text-secondary'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-1`}
                >
                  {tab.id === 'ai' && <AiSparkleIcon className="w-4 h-4" />}
                  {tab.name}
                </button>
               )
            ))}
          </nav>
        </div>

        <div className="p-4 flex-grow overflow-auto">
          {activeResponseTab === 'body' && (
            <pre className="text-sm bg-gem-bg p-2 rounded-md whitespace-pre-wrap break-all">
                {JSON.stringify(displayData, null, 2)}
            </pre>
          )}
          {activeResponseTab === 'headers' && (
             <pre className="text-sm bg-gem-bg p-2 rounded-md whitespace-pre-wrap break-all">
                {JSON.stringify(response?.headers, null, 2)}
            </pre>
          )}
          {activeResponseTab === 'ai' && isError && <AiAnalysis />}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gem-panel border border-gem-border rounded-lg h-full flex flex-col overflow-hidden">
        {renderContent()}
    </div>
  );
};

export default ResponsePanel;
