import processVariantFiles from ".";
import { memfs } from "memfs";
import { posix } from "path";
const { resolve, basename, join, sep } = posix;

describe("processVariantFiles", () => {
  let joinPointFiles;
  const pointCut = { name: "test-point-cut" };
  const joinPointResolver = jest.fn();
  let warnings;

  const variantFileGlob = "test-variant-*.*";
  const variantGlob = `/${variantFileGlob}`;
  const appRoot = "/test-app-root/";
  const moduleFile = "test-module.js";
  const joinPointFolder = "test-folder";
  const joinPointPath = join(joinPointFolder, moduleFile);
  const { fs: fileSystem } = memfs({
    [`${appRoot}${joinPointPath}`]: "join point"
  });

  beforeEach(() => {
    warnings = [];
    joinPointFiles = new Map();
  });

  const act = async ({ variantFiles, configFiles }) => {
    await processVariantFiles({
      variantFiles,
      configFiles,
      joinPointFiles,
      pointCut,
      joinPointResolver,
      variantGlob,
      warnings,
      name: moduleFile,
      fileSystem,
      appRoot
    });
  };

  describe("when given no variant files", () => {
    beforeEach(async () => {
      await act({ variantFiles: [], configFiles: new Map() });
    });

    it("should add no warnings, and not modify joinPointFiles", async () => {
      expect(warnings).toEqual([]);
      expect(joinPointFiles).toEqual(new Map());
    });
  });

  const variantFilePath = variantFileGlob.replaceAll("*", "1");

  describe.each`
    variantFilePath                 | expectedVariant
    ${variantFilePath}              | ${"." + sep + variantFilePath}
    ${"." + variantFilePath}        | ${"." + variantFilePath}
    ${"." + sep + variantFilePath}  | ${"." + sep + variantFilePath}
    ${".." + sep + variantFilePath} | ${".." + sep + variantFilePath}
  `(
    "when given a variant path ($variantFilePath)",
    ({ variantFilePath, expectedVariant }) => {
      const variantFiles = [
        {
          name: basename(variantFilePath),
          path: resolve(joinPointFolder, variantFilePath)
        }
      ];

      describe("when given a variant file that has no matching join point file", () => {
        beforeEach(async () => {
          joinPointResolver.mockReturnValue(
            join(joinPointFolder, "test-not-matching-control")
          );
          await act({ variantFiles, configFiles: new Map() });
        });

        it("should add no warnings, and not modify joinPointFiles", async () => {
          expect(warnings).toEqual([]);
          expect(joinPointFiles).toEqual(new Map());
        });
      });

      describe("when given a variant file that has a matching join point file", () => {
        beforeEach(async () => {
          joinPointResolver.mockReturnValue(joinPointPath);
        });

        describe("and no config file precludes it being valid", () => {
          beforeEach(async () => {
            await act({ variantFiles, configFiles: new Map() });
          });

          it("should add no warnings, and add a single joinPointFile representing the matched join point", async () => {
            expect(warnings).toEqual([]);
            expect(joinPointFiles).toEqual(
              new Map([
                [
                  joinPointPath,
                  {
                    pointCut,
                    variants: [expectedVariant]
                  }
                ]
              ])
            );
          });
        });

        describe("and a config file confirms it as valid", () => {
          beforeEach(async () => {
            await act({
              variantFiles,
              configFiles: new Map([
                [joinPointFolder, { joinPoints: [moduleFile] }]
              ])
            });
          });

          it("should add no warnings, and add a single joinPointFile representing the matched join point", async () => {
            expect(warnings).toEqual([]);
            expect(joinPointFiles).toEqual(
              new Map([
                [
                  joinPointPath,
                  {
                    pointCut,
                    variants: [expectedVariant]
                  }
                ]
              ])
            );
          });
        });

        describe("and a config file precludes it from being valid", () => {
          beforeEach(async () => {
            await act({
              variantFiles,
              configFiles: new Map([[joinPointFolder, { joinPoints: [] }]])
            });
          });

          it("should add no warnings, and not modify joinPointFiles", async () => {
            expect(warnings).toEqual([]);
            expect(joinPointFiles).toEqual(new Map());
          });
        });

        describe("and a preceding point cut already identified the join point", () => {
          const testOtherPointCut = { name: "test-other-point-cut" };
          beforeEach(async () => {
            joinPointFiles.set(joinPointPath, {
              pointCut: testOtherPointCut
            });
            await act({
              variantFiles,
              configFiles: new Map()
            });
          });

          it("should add a warning, and not modify joinPointFiles", async () => {
            expect(warnings).toEqual([
              `Join point "${joinPointPath}" is already assigned to point cut "${testOtherPointCut.name}". Skipping assignment to "${pointCut.name}".`
            ]);
            expect(joinPointFiles).toEqual(
              new Map([
                [
                  joinPointPath,
                  {
                    pointCut: testOtherPointCut
                  }
                ]
              ])
            );
          });
        });
      });
    }
  );
});
