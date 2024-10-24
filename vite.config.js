import { defineConfig, build } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs/promises'

let bundling = false

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'hot-build',
      enforce: "pre",
      handleHotUpdate: async () => {
        if (!bundling) {
          bundling = true
          await build({'build': { outDir: './dist'}})
          bundling = false
        }
        return []
      }
    },
    {
      name: 'copy-file',
      apply: 'build',
      closeBundle: async () => {
        await fs.cp('crx_file', 'dist', { recursive: true })
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        'popup': 'popup.html',
        'option': 'option.html',
      },
    },
    outDir: 'dist',
  },
})
