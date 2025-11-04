import { GoogleGenAI } from "@google/genai";
import { ApiError, RequestData } from '../types';
import { ApiKeyManager } from "../ApiKeyManager";

const formatRequestForPrompt = (request: RequestData): string => {
    const enabledParams = request.params.filter(p => p.enabled && p.key);
    const enabledHeaders = request.headers.filter(h => h.enabled && h.key);

    let prompt = `
Request Method: ${request.method}
Request URL: ${request.url}
`;
    if (enabledParams.length > 0) {
        prompt += '\nQuery Parameters:\n' + enabledParams.map(p => `${p.key}: ${p.value}`).join('\n');
    }
    if (enabledHeaders.length > 0) {
        prompt += '\nHeaders:\n' + enabledHeaders.map(h => `${h.key}: ${h.value}`).join('\n');
    }
    if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        prompt += `\nRequest Body:\n\`\`\`json\n${request.body}\n\`\`\``;
    }
    return prompt;
};

const formatErrorForPrompt = (error: ApiError): string => {
    let prompt = `\n--- FAILED RESPONSE ---
Error Message: ${error.message}
`;
    if (error.response) {
        prompt += `\nStatus Code: ${error.response.status} ${error.response.statusText}`;
        try {
            prompt += `\nResponse Body:\n\`\`\`json\n${JSON.stringify(error.response.data, null, 2)}\n\`\`\``;
        } catch(e) {
            prompt += `\nResponse Body (unparsable):\n\`\`\`\n${error.response.data}\n\`\`\``;
        }
        prompt += `\nResponse Headers:\n${JSON.stringify(error.response.headers, null, 2)}`;
    }
    return prompt;
}

export async function* analyzeApiError(
    request: RequestData, 
    error: ApiError,
    apiKeyManager: ApiKeyManager
): AsyncGenerator<string> {
    const apiKey = await apiKeyManager.getApiKey();
    if (!apiKey) {
        yield "### AI Analysis Skipped\nYour Gemini API key is not set. Please add it using the `ServerGem: Set API Key` command to enable AI-powered error diagnosis.";
        return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
You are ServerGem, an expert backend developer and API specialist integrated into a VSCode extension. Your task is to analyze a failed API request and provide a clear, concise, and actionable diagnosis.

**Analysis Task:**
1.  **Identify the Root Cause:** Based on the request and the error response, what is the most likely reason for the failure?
2.  **Explain the Problem:** Briefly explain the issue in simple terms.
3.  **Suggest Solutions:** Provide specific, actionable steps the developer can take to fix the problem. Include code examples if relevant.
4.  **Format your response in Markdown.** Use headings, bullet points, and code blocks for clarity.

Here is the data for the failed API request:

--- API REQUEST DETAILS ---
${formatRequestForPrompt(request)}
${formatErrorForPrompt(error)}

--- YOUR ANALYSIS ---
`;

    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: [{ parts: [{ text: prompt }] }],
        });

        for await (const chunk of response) {
            yield chunk.text;
        }

    } catch (e: any) {
        console.error("Error calling Gemini API:", e);
        yield `An error occurred while communicating with the Gemini API. Please check your API key and network connection. Error: ${e.message}`;
    }
}