// jest.config.ts
import type { InitialOptionsTsJest } from "ts-jest/dist/types";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: InitialOptionsTsJest = {
  globals: {
    "ts-jest": {
      // ts-jest configuration goes here
      compiler: "typescript",
      tsconfig: "tsconfig.json",
      // isolatedModules: false,
      // astTransformers: {},
      // diagnostics: true,
      // babelConfig: false,
      // stringifyContentPathRegex: "disabled",
      useESM: true,
    },
  },
  transform: {
    ...tsjPreset.transform,
  },
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
};
export default config;
