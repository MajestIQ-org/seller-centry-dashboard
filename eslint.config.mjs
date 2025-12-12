import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Project-specific generated outputs:
    "dist/**",
    "playwright-report/**",
    "test-results/**",

    // Supabase Edge Functions (Deno runtime, not linted by Next rules):
    "supabase/functions/**",

    // PostCSS config is ESM and not part of app code:
    "postcss.config.js",
  ]),

  // The react-hooks rule `set-state-in-effect` is too aggressive for common async flows.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
