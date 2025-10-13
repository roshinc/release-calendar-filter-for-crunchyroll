import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment (happy-dom is lightweight browser-like environment)
    environment: 'node',

    // Include test files
    include: ['**/*.test.js', '**/*.spec.js'],

    // Exclude directories
    exclude: ['node_modules', 'dist', 'dist_firefox', 'stats'],

    // Coverage configuration (optional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules',
        'dist',
        'dist_firefox',
        'rollup_plugin',
        'rollup.config.js',
        '**/*.test.js',
        '**/*.spec.js',
      ],
    },
  },
});