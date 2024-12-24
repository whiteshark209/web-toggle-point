import validateConfigSchema from "./index";
import { PLUGIN_NAME } from "../../../constants";
import { validate } from "schema-utils";

jest.mock("schema-utils", () => ({
  validate: jest.fn()
}));
jest.mock("./configSchema.json", () => ({}));
jest.mock("../../../constants", () => ({
  PLUGIN_NAME: "test-plugin-name"
}));

describe("validateConfigSchema", () => {
  const configFile = Symbol("test-config-file");
  const appRoot = "/test-app-root";
  const folder = "test-folder";

  beforeEach(() => {
    validateConfigSchema({ configFile, appRoot, path: `${appRoot}/${folder}` });
  });

  it("should validate the schema of the config file, and output with the plugin name and 'toggle config' as the data path that errored", () => {
    expect(validate).toHaveBeenCalledWith({}, configFile, {
      name: PLUGIN_NAME,
      baseDataPath: "toggle config",
      postFormatter: expect.any(Function)
    });
  });

  describe("when the error is formatted", () => {
    let formattedError;

    beforeEach(() => {
      const [, , { postFormatter }] = validate.mock.lastCall;
      formattedError = postFormatter("test-error with toggle config");
    });

    it("should replace the phrase 'toggle config' in the error body with the relative path to the config file", () => {
      expect(formattedError).toBe(`test-error with ${folder}`);
    });
  });
});
