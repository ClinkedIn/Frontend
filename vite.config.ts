import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });
export default defineConfig({
  plugins: [react(), tailwindcss(),
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
  }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false,
    },
  }
  },
});