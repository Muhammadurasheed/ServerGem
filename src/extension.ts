import * as vscode from 'vscode';
import { MainPanel } from './panels/MainPanel';
import { ApiKeyManager } from './ApiKeyManager';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "servergem" is now active!');

  const apiKeyManager = new ApiKeyManager(context.secrets);

  context.subscriptions.push(
    vscode.commands.registerCommand('servergem.start', () => {
      MainPanel.createOrShow(context.extensionUri, apiKeyManager);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('servergem.setApiKey', async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Google Gemini API Key',
        password: true,
        ignoreFocusOut: true,
        placeHolder: 'Your API Key',
      });

      if (apiKey) {
        await apiKeyManager.setApiKey(apiKey);
        vscode.window.showInformationMessage('ServerGem: Gemini API Key saved successfully.');
        // If panel is open, notify it
        if(MainPanel.currentPanel) {
            MainPanel.currentPanel.postMessage({ command: 'apiKeySet' });
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('servergem.clearApiKey', async () => {
        const selection = await vscode.window.showWarningMessage(
            'Are you sure you want to clear your Gemini API Key?',
            { modal: true },
            'Yes'
        );
        if (selection === 'Yes') {
            await apiKeyManager.deleteApiKey();
            vscode.window.showInformationMessage('ServerGem: Gemini API Key cleared.');
        }
    })
  );
}

export function deactivate() {}
