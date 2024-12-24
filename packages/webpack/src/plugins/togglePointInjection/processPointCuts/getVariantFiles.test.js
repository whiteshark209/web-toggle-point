import { fs as fileSystem, vol } from "memfs";
import { join, sep } from "path";
import getVariantFiles from "./getVariantFiles";

describe("getVariantFiles", () => {
  const appRoot = "/test-folder";
  let result;
  beforeEach(async () => {
    vol.fromJSON(
      {
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-matching-file-1.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-non-matching-folder",
          "test-matching-file.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-matching-file-2.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-non-matching-file.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-non-matching-folder",
          "test-non-matching-file.js"
        )]: ""
      },
      sep
    );

    result = await getVariantFiles({
      variantGlob: "./**/test-matching-folder/**/test-matching-*.js",
      appRoot,
      fileSystem
    });
  });

  it("should return the matching files as an object with the file name and the path relative to the application root", () => {
    expect(result).toEqual([
      expect.objectContaining({
        name: "test-matching-file-1.js",
        path: "/test-matching-folder/test-matching-file-1.js"
      }),
      expect.objectContaining({
        name: "test-matching-file-2.js",
        path: "/test-matching-folder/test-matching-file-2.js"
      })
    ]);
  });
});
