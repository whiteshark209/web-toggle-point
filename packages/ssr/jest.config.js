export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup-after-env.js"],
  globals: {
    CLIENT: false
  }
};
