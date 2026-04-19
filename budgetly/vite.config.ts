import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/ugly-build-with-bootstrap-group1/",
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["raye-contractional-bryant.ngrok-free.dev"],
  },
});
