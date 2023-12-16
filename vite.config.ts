import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/socket.io/": {
        target: "https://zapiski-server.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
