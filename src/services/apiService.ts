import { analyzeApiError } from './geminiService';
import { MainPanel } from '../panels/MainPanel';
import { ApiKeyManager } from '../ApiKeyManager';
import { ApiError, ApiResponse, RequestData } from '../types';

export const sendApiRequest = async (
    requestData: RequestData,
    panel: MainPanel,
    apiKeyManager: ApiKeyManager
) => {
    const startTime = Date.now();
    
    try {
        const url = new URL(requestData.url);
        requestData.params
            .filter(p => p.enabled && p.key)
            .forEach(p => url.searchParams.append(p.key, p.value));

        const headers: Record<string, string> = {};
        requestData.headers
            .filter(h => h.enabled && h.key)
            .forEach(h => headers[h.key] = h.value);

        const requestOptions: RequestInit = {
            method: requestData.method,
            headers: headers,
        };

        if (['POST', 'PUT', 'PATCH'].includes(requestData.method)) {
            requestOptions.body = requestData.body;
            if (!Object.keys(headers).some(h => h.toLowerCase() === 'content-type') && requestData.body) {
                try {
                    JSON.parse(requestData.body);
                    headers['Content-Type'] = 'application/json';
                } catch (e) {
                    // Not JSON, default to text/plain
                    headers['Content-Type'] = 'text/plain';
                }
            }
        }

        const fetchResponse = await fetch(url.toString(), requestOptions);
        const responseData = await parseResponse(fetchResponse);
        const responseHeaders: Record<string, string> = {};
        fetchResponse.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        const apiResponse: ApiResponse = {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            data: responseData,
            headers: responseHeaders,
            time: Date.now() - startTime,
        };

        if (!fetchResponse.ok) {
            const error: ApiError = {
                message: `HTTP error ${fetchResponse.status}`,
                response: apiResponse,
            };
            throw error;
        }

        panel.postMessage({ command: 'response', payload: apiResponse });

    } catch (e: any) {
        let error: ApiError;
        if (e.response) { // It's already a structured ApiError
             error = { message: e.message, response: e.response };
        } else { // It's a generic Error (e.g., network failure)
            const errorResponse: ApiResponse = {
                status: 0, // Using 0 for client-side errors like network/DNS issues
                statusText: 'Client Error',
                data: { error: "Request Failed", message: e.message, code: e.cause?.code },
                headers: {},
                time: Date.now() - startTime,
            };
             error = { message: e.message, response: errorResponse };
        }

        panel.postMessage({ command: 'error', payload: error });
        
        try {
            const stream = analyzeApiError(requestData, error, apiKeyManager);
            for await (const chunk of stream) {
                panel.postMessage({ command: 'aiResponseChunk', payload: chunk });
            }
        } catch (aiError: any) {
            panel.postMessage({ command: 'aiResponseChunk', payload: `\n**AI Analysis Failed:** ${aiError.message}` });
        } finally {
            panel.postMessage({ command: 'aiResponseComplete' });
        }
    }
};

async function parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (e) {
            // If JSON parsing fails, return the raw text.
            return response.text();
        }
    }
    return response.text();
}