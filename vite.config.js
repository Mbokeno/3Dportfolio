import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches your deployment settings
  },
  base: '/', // Adjust this if your project is not at the root
}
})
