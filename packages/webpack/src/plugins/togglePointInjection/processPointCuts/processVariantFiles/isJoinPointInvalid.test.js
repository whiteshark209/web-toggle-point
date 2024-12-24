import { TOGGLE_CONFIG } from "../../constants";
import isJoinPointInvalid from "./isJoinPointInvalid";
import { memfs } from "memfs";
import validateConfigSchema from "./validateConfigSchema";
import { join } from "path";

jest.mock("../../constants", () => ({
  TOGGLE_CONFIG: "test-toggle-config-filename"
}));
jest.mock("./validateConfigSchema", () => jest.fn());

const appRoot = "test-app-root";
const joinDirectory = "test-join-directory";
const mockJoinPoint = "test-join-point";
const joinPointPath = join(joinDirectory, mockJoinPoint);
const toggleConfigPath = join(appRoot, joinDirectory, TOGGLE_CONFIG);
const joinPointFullPath = join(appRoot, joinPointPath);

describe("isJoinPointInvalid", () => {
  let result, configFiles, fileSystem, vol;

  beforeEach(() => {
    configFiles = new Map();
    ({ fs: fileSystem, vol } = memfs());
    vol.fromJSON({ [join(appRoot, joinDirectory)]: {} });
    jest.spyOn(fileSystem, "stat");
    jest.spyOn(fileSystem, "readFile");
  });

  const act = () =>
    isJoinPointInvalid({
      configFiles,
      name: mockJoinPoint,
      fileSystem,
      appRoot,
      joinPointPath,
      joinDirectory
    });

  const makeSecondCallAssertions = (expectedResult) => {
    describe("when a supplementary call to isJoinPointValid is made for the same join directory", () => {
      beforeEach(async () => (result = await act()));

      it("should not attempt to stat (or read) the config file again", () => {
        expect(
          fileSystem.stat.mock.calls.filter(
            ([path]) => path === toggleConfigPath
          )
        ).toHaveLength(1);
        if (fileSystem.readFile.mock.calls.length) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            fileSystem.readFile.mock.calls.filter(
              ([path]) => path === toggleConfigPath
            )
          ).toHaveLength(1);
        }
      });

      it(`should return ${expectedResult}`, () => {
        expect(result).toBe(expectedResult);
      });
    });
  };

  describe("when a config file exists for the join directory", () => {
    let configFile;
    beforeEach(() => {
      validateConfigSchema.mockClear();
    });

    const makeCommonAssertions = () => {
      it("should validate the schema of the toggle config", () => {
        expect(validateConfigSchema).toHaveBeenCalledWith({
          configFile,
          appRoot,
          path: toggleConfigPath
        });
      });
    };

    describe("and the join point is not in the config file", () => {
      beforeEach(() => {
        configFile = { joinPoints: [] };
        fileSystem.writeFileSync(toggleConfigPath, JSON.stringify(configFile));
      });

      describe("and the join point file does not exist", () => {
        beforeEach(async () => (result = await act()));

        it("should return true", () => {
          expect(result).toBe(true);
        });

        makeCommonAssertions();
        makeSecondCallAssertions(true);
      });

      describe("and the join point file exists", () => {
        beforeEach(async () => {
          fileSystem.writeFileSync(joinPointFullPath, "test-content");
          result = await act();
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });

        makeCommonAssertions();
        makeSecondCallAssertions(true);
      });
    });

    describe("and the join point is in the config file", () => {
      beforeEach(() => {
        configFile = {
          joinPoints: [mockJoinPoint]
        };
        fileSystem.writeFileSync(toggleConfigPath, JSON.stringify(configFile));
      });

      describe("and the join point file does not exist", () => {
        beforeEach(async () => (result = await act()));

        it("should return true", () => {
          expect(result).toBe(true);
        });

        makeCommonAssertions();
        makeSecondCallAssertions(true);
      });

      describe("and the join point file exists", () => {
        beforeEach(async () => {
          fileSystem.writeFileSync(joinPointFullPath, "test-content");
          result = await act();
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });

        makeCommonAssertions();
        makeSecondCallAssertions(false);
      });
    });
  });

  describe("when a config file does not exist for the join directory", () => {
    describe("and the join point file does not exist", () => {
      beforeEach(async () => (result = await act()));

      it("should return true", () => {
        expect(result).toBe(true);
      });

      makeSecondCallAssertions(true);
    });

    describe("and the join point file exists", () => {
      beforeEach(async () => {
        fileSystem.writeFileSync(joinPointFullPath, "test-content");
        result = await act();
      });

      it("should return false", () => {
        expect(result).toBe(false);
      });

      makeSecondCallAssertions(false);
    });
  });
});
