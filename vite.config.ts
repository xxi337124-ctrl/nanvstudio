import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // 代理 Gemini API 请求
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gemini/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 从服务器端环境变量获取 API Key
              const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
              if (apiKey && apiKey !== 'PLACEHOLDER_API_KEY') {
                // 自动添加 API Key 到请求
                const url = new URL(req.url || '', 'http://dummy');
                url.searchParams.set('key', apiKey);
                proxyReq.path = url.pathname + url.search;
              }
            });
          },
        },
      },
    },
    plugins: [react()],
    // 移除 API Key 的前端注入，改用代理
    define: {
      // 仅保留开发环境标识
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
