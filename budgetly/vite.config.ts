import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/iteration-2-build-with-style-group1/",
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["raye-contractional-bryant.ngrok-free.dev"],
  },
});
