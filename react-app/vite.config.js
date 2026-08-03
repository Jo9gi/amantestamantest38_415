import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const frontendUrl = env.VITE_FRONTEND_URL || 5173;
  const port = 5173;

  return {
    plugins: [react()],
    server: {
      host: true,
      port: port,
      allowedHosts: true,
      hmr: false,
    },
  };
});
