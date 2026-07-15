import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'es2023',
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  clean: true,
  skipNodeModulesBundle: true, 
  noExternal: [] 
});