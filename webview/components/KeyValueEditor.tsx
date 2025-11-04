import React from 'react';
import { KeyValuePair } from '../../src/types';

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ items, onChange }) => {
  const handleItemChange = <K extends keyof KeyValuePair>(
    id: string,
    field: K,
    value: KeyValuePair[K]
  ) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      onChange(items.filter((item) => item.id !== id));
    } else {
       onChange([{ id: Date.now().toString(), key: '', value: '', enabled: true }])
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
      if(e.key === 'Enter') {
          const currentIndex = items.findIndex(item => item.id === id);
          if (currentIndex === items.length - 1) {
              addItem();
          }
      }
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={(e) => handleItemChange(item.id, 'enabled', e.target.checked)}
            className="form-checkbox h-4 w-4 text-gem-accent bg-gem-bg border-gem-border rounded focus:ring-gem-accent"
          />
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => handleItemChange(item.id, 'key', e.target.value)}
            className="flex-grow bg-gem-bg border border-gem-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gem-accent"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            className="flex-grow bg-gem-bg border border-gem-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gem-accent"
          />
          <button
            onClick={() => removeItem(item.id)}
            className="text-gem-text-secondary hover:text-gem-red p-1 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="text-sm text-gem-accent hover:text-gem-accent-hover"
      >
        + Add Row
      </button>
    </div>
  );
};

export default KeyValueEditor;
