import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "import.meta.env.VITE_REACT_APP_SERVER_PORT": JSON.stringify(
        env.VITE_REACT_APP_SERVER_PORT
      ),
      "import.meta.env.VITE_REACT_APP_API_BASE_URL": JSON.stringify(
        env.VITE_REACT_APP_API_BASE_URL
      ),
    },
    plugins: [react()],
  };
});
