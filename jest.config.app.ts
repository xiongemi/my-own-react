/* eslint-disable */
export default {
  displayName: "my-own-react",
  preset: "./jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "./coverage/my-own-react",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)",
  ],
};
