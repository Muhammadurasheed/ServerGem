import React from 'react';

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ value, onChange }) => {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter request body (e.g., JSON)'
        className="w-full h-48 bg-gem-bg border border-gem-border rounded-md p-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gem-accent resize-y"
      />
    </div>
  );
};

export default BodyEditor;
