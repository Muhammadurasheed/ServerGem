import { HttpMethod, KeyValuePair, ApiResponse, ApiError } from '../src/types';

export interface WebviewState {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  response: ApiResponse | null;
  error: ApiError | null;
  loading: boolean;
  activeRequestTab: 'params' | 'headers' | 'body';
  activeResponseTab: 'body' | 'headers' | 'ai';
  aiResponse: string;
  aiLoading: boolean;
  apiKeyChecked: boolean;
  hasApiKey: boolean;

  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setParams: (params: KeyValuePair[]) => void;
  setHeaders: (headers: KeyValuePair[]) => void;
  setBody: (body: string) => void;
  setActiveRequestTab: (tab: 'params' | 'headers' | 'body') => void;
  setActiveResponseTab: (tab: 'body' | 'headers' | 'ai') => void;
  setApiKeyChecked: (checked: boolean) => void;
  setHasApiKey: (has: boolean) => void;
  sendRequest: () => Promise<void>;
  
  // Handlers for extension messages
  handleResponse: (response: ApiResponse) => void;
  handleError: (error: ApiError) => void;
  handleAiChunk: (chunk: string) => void;
  handleAiComplete: () => void;
}
