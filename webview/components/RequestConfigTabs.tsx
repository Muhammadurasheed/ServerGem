import React from 'react';
import { useApiStore } from '../store/useApiStore';
import KeyValueEditor from './KeyValueEditor';
import BodyEditor from './BodyEditor';

const RequestConfigTabs: React.FC = () => {
  const { activeRequestTab, setActiveRequestTab, params, setParams, headers, setHeaders, body, setBody, method } = useApiStore();

  const tabs = [
    { name: 'Params', id: 'params' as const },
    { name: 'Headers', id: 'headers' as const },
    { name: 'Body', id: 'body' as const },
  ];

  const hasBody = [ 'POST', 'PUT', 'PATCH' ].includes(method);

  return (
    <div>
      <div className="border-b border-gem-border">
        <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveRequestTab(tab.id)}
              disabled={tab.id === 'body' && !hasBody}
              className={`${
                activeRequestTab === tab.id
                  ? 'border-gem-accent text-gem-accent'
                  : 'border-transparent text-gem-text-secondary hover:text-gem-text hover:border-gem-text-secondary'
              }
              ${(tab.id === 'body' && !hasBody) ? 'opacity-50 cursor-not-allowed' : ''}
              whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        {activeRequestTab === 'params' && (
          <KeyValueEditor items={params} onChange={setParams} />
        )}
        {activeRequestTab === 'headers' && (
          <KeyValueEditor items={headers} onChange={setHeaders} />
        )}
        {activeRequestTab === 'body' && hasBody && (
          <BodyEditor value={body} onChange={setBody} />
        )}
         {activeRequestTab === 'body' && !hasBody && (
          <div className="text-center text-gem-text-secondary text-sm p-8">
            The {method} method does not have a request body.
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestConfigTabs;
