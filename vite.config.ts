import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import sassDts from 'vite-plugin-sass-dts';

const debug = true;

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        modules: {
            generateScopedName: debug ? '[name]_[local]_[hash:base64:5]' : '[hash:base64:5]',
        },
    },
    clearScreen: false,
    server: {
        strictPort: true,
    },
    define: {
        __LOADOUT_EDITOR_FLAVOR__: JSON.stringify(debug ? 'dev' : 'prod'),
    },
    build: {
        target: ['es2021', 'chrome100', 'safari13'],
        minify: !debug ? 'esbuild' : false,
        sourcemap: debug,
    },
    plugins: [
        react({
            jsxImportSource: '@welldone-software/why-did-you-render',
        }),
        sassDts({
            enabledMode: ['development', 'production'],
        }),
        visualizer({
            sourcemap: debug,
        }),
    ],
});