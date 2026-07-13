import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Maps '@' to your 'src' directory
    },
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: {},
    },
  },
  optimizeDeps: {
    include: ["react-slick"],
  },
  server: {
    port: 3000,
  },
});
