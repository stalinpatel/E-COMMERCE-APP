import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindscrollbar from "tailwind-scrollbar";

export default defineConfig({
  plugins: [tailwindcss(), react(), tailwindscrollbar()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
});
