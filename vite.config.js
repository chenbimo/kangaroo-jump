import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: sveltePreprocess()
        }),
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: '袋鼠快跳',
                author: '陈随易',
                license: 'MIT',
                icon: 'https://static.yicode.tech/logo/kuaitiao2.png',
                namespace: 'https://chensuiyi.me',
                match: ['*://*/*'],
                description: '浏览器快捷跳转'
            }
        })
    ]
});
