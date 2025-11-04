import { create } from 'zustand';
import { HttpMethod, KeyValuePair, ApiResponse, ApiError } from '../../src/types';
import { vscode } from '../vscode';
import { WebviewState } from '../types';

// Load initial state from VS Code's persisted state for this webview
const initialState = vscode.getState() || {
  method: HttpMethod.GET,
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  params: [{ id: '1', key: '', value: '', enabled: true }],
  headers: [{ id: '1', key: '', value: '', enabled: true }],
  body: JSON.stringify({ message: "Hello, ServerGem!" }, null, 2),
  response: null,
  error: null,
  loading: false,
  activeRequestTab: 'params',
  activeResponseTab: 'body',
  aiResponse: '',
  aiLoading: false,
  apiKeyChecked: false,
  hasApiKey: true,
};


export const useApiStore = create<WebviewState>()((set, get) => ({
  ...initialState,

  setMethod: (method) => {
    const hasBody = [ 'POST', 'PUT', 'PATCH' ].includes(method);
    set({ method });
    if (!hasBody && get().activeRequestTab === 'body') {
      set({ activeRequestTab: 'params' });
    }
  },
  setUrl: (url) => set({ url }),
  setParams: (params) => set({ params }),
  setHeaders: (headers) => set({ headers }),
  setBody: (body) => set({ body }),
  setActiveRequestTab: (tab) => set({ activeRequestTab: tab }),
  setActiveResponseTab: (tab) => set({ activeResponseTab: tab }),
  setApiKeyChecked: (checked) => set({ apiKeyChecked: checked }),
  setHasApiKey: (has) => set({ hasApiKey: has }),


  sendRequest: async () => {
    set({ loading: true, response: null, error: null, aiResponse: '', aiLoading: false, activeResponseTab: 'body' });
    const { method, url, params, headers, body } = get();
    vscode.postMessage({ command: 'sendRequest', payload: { method, url, params, headers, body } });
  },

  // Actions to be called by the message handler
  handleResponse: (response) => set({ response, loading: false, error: null }),
  handleError: (error) => set({ error, response: error.response || null, loading: false, activeResponseTab: 'ai', aiLoading: true, aiResponse: '' }),
  handleAiChunk: (chunk) => set((state) => ({ aiResponse: state.aiResponse + chunk })),
  handleAiComplete: () => set({ aiLoading: false }),
}));

// Subscribe to state changes and save to VS Code's state automatically
useApiStore.subscribe((state) => {
  // Functions are not serializable and should not be persisted.
  const stateToSave = { ...state };
  vscode.setState(stateToSave);
});
