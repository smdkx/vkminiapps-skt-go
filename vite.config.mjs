import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build',
        target: ['chrome84', 'safari15', 'firefox115', 'edge109'],
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {name: 'vkui', test: /node_modules\/@vkontakte\/(vkui|icons|vkjs)\//, priority: 20},
                        {name: 'react', test: /node_modules\/(react|react-dom|scheduler)\//, priority: 10},
                        {name: 'dates', test: /node_modules\/moment\//},
                    ],
                },
            },
        },
    },
    server: {
        strictPort: true,
        watch: {ignored: ['**/.npm/**']},
    },
});
