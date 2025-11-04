// --- Data Structures ---
export enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT',
  DELETE = 'DELETE', PATCH = 'PATCH', HEAD = 'HEAD', OPTIONS = 'OPTIONS',
}

export interface KeyValuePair {
  id: string; key: string; value: string; enabled: boolean;
}

export interface ApiResponse {
  status: number; statusText: string; data: any; headers: Record<string, string>; time: number;
}

export interface ApiError {
  message: string; response?: ApiResponse;
}

export interface RequestData {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
}

// --- Webview Message Contract ---

// From Webview to Extension
export type FromWebviewMessage = 
  | { command: 'sendRequest'; payload: RequestData }
  | { command: 'checkApiKey' }
  | { command: 'openApiKeyPanel' };


// From Extension to Webview
export type ToWebviewMessage =
  | { command: 'response'; payload: ApiResponse }
  | { command: 'error'; payload: ApiError }
  | { command: 'aiResponseChunk'; payload: string }
  | { command: 'aiResponseComplete' }
  | { command: 'apiKeyStatus', payload: { hasApiKey: boolean } }
  | { command: 'apiKeySet' };
