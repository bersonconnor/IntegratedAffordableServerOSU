module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  reporters: [
    "default"
    //   ["./node_modules/jest-html-reporter", {
    //       pageTitle: "Test Report for Affordable Frontend",
    //       includeFailureMsg: true,
    //   }],
    //   "jest-junit"
  ],
  coverageReporters: ["json", "html"],
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
