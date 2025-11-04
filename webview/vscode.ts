import type { FromWebviewMessage } from '../../src/types';

interface VsCodeApi {
  postMessage(message: FromWebviewMessage): void;
  getState(): any;
  setState(newState: any): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

// By directly calling this, we ensure the app can only run in a true VSCode webview.
// This removes the mock fallback that was causing the infinite loading issue.
export const vscode = acquireVsCodeApi();
