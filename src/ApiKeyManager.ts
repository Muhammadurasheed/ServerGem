import * as vscode from 'vscode';

const SECRET_KEY = 'servergem.geminiApiKey';

export class ApiKeyManager {
  constructor(private secretStorage: vscode.SecretStorage) {}

  async setApiKey(apiKey: string): Promise<void> {
    await this.secretStorage.store(SECRET_KEY, apiKey);
  }

  async getApiKey(): Promise<string | undefined> {
    return await this.secretStorage.get(SECRET_KEY);
  }

  async deleteApiKey(): Promise<void> {
    await this.secretStorage.delete(SECRET_KEY);
  }
}
