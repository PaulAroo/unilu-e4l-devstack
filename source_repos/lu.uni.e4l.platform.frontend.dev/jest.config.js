module.exports = {
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$": "<rootDir>/__mocks__/fileMock.js"
    // ADD THIS LINE BELOW to fix the "node:stream" error:
    // "^node:(.*)$": "$1"
  },
  setupTestFrameworkScriptFile: "<rootDir>/src/setupTests.js",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e4l.frontend.docker/",
    "<rootDir>/src/e2e/"
  ]
};