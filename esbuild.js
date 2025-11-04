const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.argv.includes('--production');
const isWatching = process.argv.includes('--watch');

const extensionConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node18',
  external: ['vscode'],
  sourcemap: !isProduction,
  minify: isProduction,
};

const webviewConfig = {
  entryPoints: ['webview/main.tsx'],
  bundle: true,
  outfile: 'dist/webview.js',
  platform: 'browser',
  target: 'es2020',
  sourcemap: !isProduction,
  minify: isProduction,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  // To use React 19 from CDN
  external: ['react', 'react-dom', 'zustand', '@google/genai'],
};

async function build() {
  try {
    if (isWatching) {
        console.log('[watch] build started');
        esbuild.context(extensionConfig).then(ctx => ctx.watch());
        esbuild.context(webviewConfig).then(ctx => ctx.watch());
    } else {
        console.log('[build] build started');
        await esbuild.build(extensionConfig);
        await esbuild.build(webviewConfig);
        console.log('[build] finished');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
