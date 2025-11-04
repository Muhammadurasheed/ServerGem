import { useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';
import { ToWebviewMessage } from '../../src/types';

export const useMessageHandler = () => {
  const { handleResponse, handleError, handleAiChunk, handleAiComplete } = useApiStore.getState();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ToWebviewMessage>) => {
      const message = event.data;
      switch (message.command) {
        case 'response':
          handleResponse(message.payload);
          break;
        case 'error':
          handleError(message.payload);
          break;
        case 'aiResponseChunk':
          handleAiChunk(message.payload);
          break;
        case 'aiResponseComplete':
          handleAiComplete();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleResponse, handleError, handleAiChunk, handleAiComplete]);
};
