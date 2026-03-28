import { createBaseConfig } from "@krosoft/tooling-eslint";

export default [
  { ignores: ["*.config.js"] },
  ...createBaseConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.eslint.json"],
  }),
];
