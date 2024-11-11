module.exports = {
  collectCoverage: true,
  coverageReporters: ["json-summary", "text"],
  coverageDirectory: "./coverage",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
};
