# ServerGem: Your Backend Copilot

ServerGem is an intelligent VSCode extension that revolutionizes backend development by combining the functionality of Postman/Thunder Client with real-time AI-powered debugging and troubleshooting using Gemini.

## Features (Phase 1)

- API request editor (Method, URL, Params, Headers, Body).
- Formatted JSON response viewer.
- Automatic, real-time AI error analysis for failed requests (4xx, 5xx).
- Secure API Key storage using VSCode's `SecretStorage`.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd servergem
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Extension

1.  Open the project folder in VSCode.
2.  Press `F5` to open a new "Extension Development Host" window with the ServerGem extension loaded.

### Available Scripts

-   `npm run compile`: Compiles the extension (both host and webview).
-   `npm run watch`: Compiles and watches for changes, enabling fast development iterations.
-   `npm run package`: Packages the extension into a `.vsix` file for distribution.
-   `npm run lint`: Lints the codebase.

## How to Use

1.  **Open the Command Palette** (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows).
2.  Run the command `ServerGem: Start` to open the main panel.
3.  Run `ServerGem: Set API Key` to securely store your Google Gemini API key.
4.  Start making requests!
