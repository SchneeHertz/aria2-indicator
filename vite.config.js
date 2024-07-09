import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs/promises'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-file',
      apply: 'build',
      closeBundle: async () => {
        await fs.cp('crx_file', 'dist', { recursive: true })
      }
    }
  ],
})
