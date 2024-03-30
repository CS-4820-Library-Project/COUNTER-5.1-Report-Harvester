// electron.vite.config.js
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  publicDir: false,
  main: {
    entry: "src/main/main.ts",
  },
  preload: {
    input: path.join(__dirname, "src/preload/preload.ts"),
  },
  renderer: {
    plugins: [react()],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/public": path.resolve(__dirname, "./public"),
      "@/rend": path.resolve(__dirname, "./src/renderer/src"),
    },
  },
  build: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    base: "./",
    outDir: "out",
  },

  base: "./",
});
