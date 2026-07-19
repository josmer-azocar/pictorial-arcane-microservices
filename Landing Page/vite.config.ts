import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

const frontendPublicDir = path.resolve(__dirname, '../frontend/public');

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'serve-frontend-public',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const filePath = path.join(frontendPublicDir, req.url ?? '');
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.end(fs.readFileSync(filePath));
            return;
          }
          next();
        });
      },
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        if (fs.existsSync(frontendPublicDir)) {
          for (const file of fs.readdirSync(frontendPublicDir)) {
            const src = path.join(frontendPublicDir, file);
            const dest = path.join(distDir, file);
            if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
              fs.copyFileSync(src, dest);
            }
          }
        }
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
