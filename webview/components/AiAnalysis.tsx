import React from 'react';
import { useApiStore } from '../store/useApiStore';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    // FIX: Changed JSX.Element to React.JSX.Element to fix "Cannot find namespace 'JSX'" error.
    const elements: React.JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: string[] = [];

    const flushList = (key: string | number) => {
        if (listItems.length > 0) {
            const ListTag = listType === 'ol' ? 'ol' : 'ul';
            const listStyle = listType === 'ol' ? 'list-decimal' : 'list-disc';
            elements.push(
                <ListTag key={`list-${key}`} className={`ml-6 ${listStyle}`}>
                    {listItems.map((item, index) => <li key={index}>{item}</li>)}
                </ListTag>
            );
            listItems = [];
        }
        listType = null;
    };

    const flushCodeBlock = (key: string | number) => {
        if (codeBlockContent.length > 0) {
            elements.push(
                <pre key={`cb-${key}`} className="bg-gem-bg text-gem-text p-3 my-2 rounded-md overflow-x-auto text-sm">
                    <code>{codeBlockContent.join('\n')}</code>
                </pre>
            );
            codeBlockContent = [];
        }
    };

    const parseInline = (line: string, key: string | number) => {
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
        return (
            <React.Fragment key={key}>
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('`') && part.endsWith('`')) {
                        return <code key={j} className="bg-gem-bg px-1 py-0.5 rounded text-gem-orange">{part.slice(1, -1)}</code>;
                    }
                    return part;
                })}
            </React.Fragment>
        );
    };

    lines.forEach((line, i) => {
        if (line.startsWith('```')) {
            flushList(i);
            if (inCodeBlock) {
                flushCodeBlock(i);
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            return;
        }

        const isUl = line.match(/^\s*[-*]\s/);
        const isOl = line.match(/^\s*\d+\.\s/);

        if (!isUl && !isOl) flushList(`pre-${i}`);

        if (line.startsWith('### ')) {
            elements.push(<h3 key={i} className="text-md font-bold mt-3 mb-1">{parseInline(line.substring(4), i)}</h3>);
        } else if (line.startsWith('## ')) {
            elements.push(<h2 key={i} className="text-lg font-bold mt-4 mb-2">{parseInline(line.substring(3), i)}</h2>);
        } else if (line.startsWith('# ')) {
            elements.push(<h1 key={i} className="text-xl font-bold mt-4 mb-2">{parseInline(line.substring(2), i)}</h1>);
        } else if (isUl) {
            if (listType !== 'ul') flushList(`pre-ul-${i}`);
            listType = 'ul';
            listItems.push(line.replace(/^\s*[-*]\s/, ''));
        } else if (isOl) {
            if (listType !== 'ol') flushList(`pre-ol-${i}`);
            listType = 'ol';
            listItems.push(line.replace(/^\s*\d+\.\s/, ''));
        } else if (line.trim() !== '') {
            elements.push(<p key={i} className="my-1">{parseInline(line, i)}</p>);
        }
    });

    flushList('end');
    flushCodeBlock('end');

    return <>{elements}</>;
};

const AiAnalysis: React.FC = () => {
  const aiResponse = useApiStore(state => state.aiResponse);
  const aiLoading = useApiStore(state => state.aiLoading);

  return (
    <div className="text-sm">
      {aiLoading && !aiResponse && (
        <div className="flex items-center text-gem-text-secondary">
          <div className="w-4 h-4 border-2 border-gem-text-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
          Gemini is analyzing the error...
        </div>
      )}
      <div className="space-y-2 prose prose-invert text-gem-text max-w-none">
        <MarkdownRenderer content={aiResponse} />
        {aiLoading && aiResponse && (
            <div className="w-2 h-2 bg-gem-accent rounded-full animate-pulse ml-1 mt-2"></div>
        )}
      </div>
    </div>
  );
};

export default AiAnalysis;