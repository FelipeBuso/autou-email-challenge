import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  // Carrega as variáveis de ambiente do .env.<mode>
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = env.VITE_API_URL || "http://localhost:8000/api";

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
      proxy: {
        "/classify-text": {
          target: API_URL,
          changeOrigin: true,
        },
        "/classify-file": {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
  });
};
