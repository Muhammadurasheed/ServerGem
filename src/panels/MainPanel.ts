import * as vscode from 'vscode';
import { sendApiRequest } from '../services/apiService';
import { ApiKeyManager } from '../ApiKeyManager';
import { FromWebviewMessage, ToWebviewMessage } from '../types';

export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _apiKeyManager: ApiKeyManager;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, apiKeyManager: ApiKeyManager) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._apiKeyManager = apiKeyManager;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    this._setWebviewMessageListener(this._panel.webview);
  }
  
  public static createOrShow(extensionUri: vscode.Uri, apiKeyManager: ApiKeyManager) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'servergem',
      'ServerGem',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
      }
    );

    MainPanel.currentPanel = new MainPanel(panel, extensionUri, apiKeyManager);
  }

  public postMessage(message: ToWebviewMessage) {
      this._panel.webview.postMessage(message);
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: FromWebviewMessage) => {
        switch (message.command) {
          case 'sendRequest':
            await sendApiRequest(message.payload, this, this._apiKeyManager);
            return;
          case 'checkApiKey':
            const key = await this._apiKeyManager.getApiKey();
            webview.postMessage({ command: 'apiKeyStatus', payload: { hasApiKey: !!key } });
            return;
          case 'openApiKeyPanel':
            vscode.commands.executeCommand('servergem.setApiKey');
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));
    const nonce = getNonce();

    return /*html*/`
      <!DOCTYPE html>
      <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' https://cdn.tailwindcss.com https://aistudiocdn.com;">
        <title>ServerGem</title>
        <script nonce="${nonce}" src="https://cdn.tailwindcss.com"></script>
        <script nonce="${nonce}">
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  'gem-bg': '#1e1e1e', 'gem-panel': '#252526', 'gem-border': '#333333',
                  'gem-text': '#cccccc', 'gem-text-secondary': '#888888', 'gem-accent': '#0e639c',
                  'gem-accent-hover': '#1177bb', 'gem-green': '#6a9955', 'gem-red': '#f44747',
                  'gem-orange': '#ce9178', 'gem-blue': '#569cd6',
                },
              },
            },
          }
        </script>
        <script nonce="${nonce}" type="importmap">
        {
          "imports": {
            "react": "https://aistudiocdn.com/react@^19.2.0",
            "react-dom": "https://aistudiocdn.com/react-dom@^19.2.0/",
            "zustand": "https://aistudiocdn.com/zustand@^5.0.8",
            "@google/genai": "https://aistudiocdn.com/@google/genai@^1.28.0"
          }
        }
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
  
  public dispose() {
    MainPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}