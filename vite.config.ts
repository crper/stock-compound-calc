import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  // ---- Vite+ staged (pre-commit) ----
  staged: {
    "*": "vp check --fix",
  },

  // ---- Vite+ formatter (oxfmt) ----
  fmt: {},

  // ---- Vite+ linter (oxlint) ----
  lint: {
    // `react-hooks/*` rules live under the `react` plugin in Oxlint
    plugins: ["unicorn", "typescript", "oxc", "react", "jsx-a11y", "promise"],
    settings: {
      react: {
        version: "19.2.3",
        linkComponents: [{ name: "Link", attributes: ["to"] }],
      },
      "jsx-a11y": {
        components: {
          Link: "a",
          Button: "button",
        },
      },
    },
    categories: {
      correctness: "error",
      suspicious: "warn",
      style: "warn",
      restriction: "off",
      perf: "off",
      nursery: "off",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // ---- 类型安全（保留：这些警告值得看） ----
      "typescript/no-explicit-any": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unsafe-argument": "error",
      "typescript/consistent-type-imports": "error",
      // `react/no-deprecated` does not exist in Oxlint; the equivalents below
      // replace the old `react-hooks/*` rules, which also live in `react`.
      "react/no-string-refs": "error",
      "react/exhaustive-deps": "error",
      "react/hooks": "error",
      "vite-plus/prefer-vite-plus-imports": "error",

      // ---- 与本项目约定冲突 / 误报（关闭）----
      // AGENTS.md 规定组件文件用 PascalCase，与 kebab-case 规则直接冲突
      "unicorn/filename-case": "off",
      // 项目使用自动 JSX runtime（jsx: react-jsx），不需要 import React
      "react/react-in-jsx-scope": "off",

      // ---- 纯风格偏好：数量大且改造成本远高于收益（关闭）----
      // 金融计算场景充满域内常量，逐个提取反而不利于阅读
      "no-magic-numbers": "off",
      // 响应式样式大量依赖三元表达式
      "no-ternary": "off",
      "no-nested-ternary": "off",
      "unicorn/no-nested-ternary": "off",
      // JSX 嵌套层级上限，移动端条件渲染天然较深
      "react/jsx-max-depth": "off",
      "one-var": "off",
      "sort-keys": "off",
      "sort-imports": "off",
      "id-length": "off",
      curly: "off",
      "max-statements": "off",
      "max-params": "off",
      "func-style": "off",
      "init-declarations": "off",
      "arrow-body-style": "off",
      "capitalized-comments": "off",
      "prefer-destructuring": "off",
      "no-duplicate-imports": "off",
      "react/function-component-definition": "off",
      "unicorn/no-null": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/switch-case-braces": "off",
      "unicorn/prefer-global-this": "off",
    },
    env: {
      browser: true,
      es2022: true,
      node: true,
    },
    overrides: [
      {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
          "no-console": "off",
        },
      },
    ],
    ignorePatterns: ["dist/**", "node_modules/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
  },

  // ---- Vite core ----
  // index.html lives in src/, so src is the Vite root
  root: "src",
  // Relative base so the build works on GitHub Pages project sub-paths
  base: "./",
  plugins: lazyPlugins(() => [react(), tailwindcss()]),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
  },

  // ---- Vitest ----
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["**/*.{ts,tsx}"],
      exclude: ["**/__tests__/**", "**/*.test.{ts,tsx}"],
    },
  },
});
