import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Generar hashes únicos para los archivos para evitar caché
    rollupOptions: {
      output: {
        // Asegurar que cada build tenga nombres únicos
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    },
    // Asegurar que el contenido se regenere correctamente
    sourcemap: false,
    minify: true
  },
  define: {
    // Agregar timestamp de build para forzar actualizaciones
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  }
}));
