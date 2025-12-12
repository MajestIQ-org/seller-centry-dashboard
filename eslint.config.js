const { defineConfig, globalIgnores } = require('eslint/config')
const nextVitals = require('eslint-config-next/core-web-vitals')
const nextTs = require('eslint-config-next/typescript')

module.exports = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',

    // Project-specific generated outputs:
    'dist/**',
    'playwright-report/**',
    'test-results/**',

    // Tooling config:
    'eslint.config.js',
    'eslint.config.mjs',

    // Supabase Edge Functions (Deno runtime, not linted by Next rules):
    'supabase/functions/**',

    // PostCSS config is ESM and not part of app code:
    'postcss.config.js',
  ]),

  // The react-hooks rule `set-state-in-effect` is too aggressive for common async flows.
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
