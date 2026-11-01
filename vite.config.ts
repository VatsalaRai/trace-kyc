import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
// base './' keeps asset paths valid under any GitHub Pages repo subpath
export default defineConfig({ base: './', plugins: [react()], test: { exclude: ['e2e/**', 'node_modules/**'] } })
