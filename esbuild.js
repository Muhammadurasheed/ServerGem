const esbuild = require('esbuild');

const isProduction = process.argv.includes('--production');
const isWatching = process.argv.includes('--watch');

let buildCount = 0;
const totalBuilds = 2; // extension + webview

// A plugin to signal when the initial builds are complete for the watcher
const onInitialBuildPlugin = {
    name: 'on-initial-build-plugin',
    setup(build) {
        build.onEnd(result => {
            if (result.errors.length > 0) {
                console.error(`[watch] build failed:`, result.errors);
            } else {
                buildCount++;
                console.log(`[watch] build succeeded (${buildCount}/${totalBuilds})`);
                if (buildCount === totalBuilds) {
                    // This is the signal that tasks.json is waiting for
                    console.log('[watch] initial builds finished');
                }
            }
        });
    },
};

const extensionConfig = {
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'dist/extension.js',
    platform: 'node',
    target: 'node18',
    external: ['vscode'],
    sourcemap: !isProduction,
    minify: isProduction,
    plugins: isWatching ? [onInitialBuildPlugin] : [],
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
    external: ['react', 'react-dom', 'zustand', '@google/genai'],
    plugins: isWatching ? [onInitialBuildPlugin] : [],
};

async function build() {
    try {
        if (isWatching) {
            console.log('[watch] build started');
            const extCtx = await esbuild.context(extensionConfig);
            const webCtx = await esbuild.context(webviewConfig);
            // This keeps the script running in watch mode
            await Promise.all([extCtx.watch(), webCtx.watch()]);
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