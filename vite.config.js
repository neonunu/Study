import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/qnet": {
        target: "http://openapi.q-net.or.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qnet/, "")
      }
    }
  }
});
