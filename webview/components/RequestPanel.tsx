import React from 'react';
import { useApiStore } from '../store/useApiStore';
import { HttpMethod } from '../../src/types';
import RequestConfigTabs from './RequestConfigTabs';
import { SendIcon } from './icons';

const RequestPanel: React.FC = () => {
  const method = useApiStore(state => state.method);
  const setMethod = useApiStore(state => state.setMethod);
  const url = useApiStore(state => state.url);
  const setUrl = useApiStore(state => state.setUrl);
  const sendRequest = useApiStore(state => state.sendRequest);
  const loading = useApiStore(state => state.loading);

  const handleSend = () => {
    if (!loading) {
      sendRequest();
    }
  };
  
  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSend();
    }
  }

  return (
    <div className="bg-gem-panel border border-gem-border rounded-lg flex flex-col h-full overflow-hidden">
      <div className="p-2 flex items-center gap-2 border-b border-gem-border flex-shrink-0">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="bg-gem-bg border border-gem-border rounded-md px-3 py-2 text-gem-text focus:outline-none focus:ring-2 focus:ring-gem-accent"
        >
          {Object.values(HttpMethod).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleUrlKeyDown}
          placeholder="https://api.example.com/data"
          className="flex-grow bg-gem-bg border border-gem-border rounded-md px-3 py-2 text-gem-text focus:outline-none focus:ring-2 focus:ring-gem-accent"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2 bg-gem-accent text-white font-bold py-2 px-4 rounded-md hover:bg-gem-accent-hover disabled:bg-gem-text-secondary disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <SendIcon className="w-5 h-5" />
              Send
            </>
          )}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <RequestConfigTabs />
      </div>
    </div>
  );
};

export default RequestPanel;
