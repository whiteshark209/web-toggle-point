import { POINT_CUTS, SCHEME } from "../constants.js";
import generateJoinPoint from "./generateJoinPoint.js";

jest.mock("../constants", () => ({
  SCHEME: "test-scheme",
  POINT_CUTS: "test-point-cuts"
}));

describe("generateJoinPoint", () => {
  const path = "test-folder/test-path";
  const pointCutName = "test-point-cut";
  const variants = [
    "test-sub-folder/test-variant-1",
    "test-sub-folder/test-variant-2",
    "test-other-sub-folder/test-variant-1"
  ];
  let result;

  beforeEach(() => {
    const joinPointFiles = new Map([
      [path, { pointCut: { name: pointCutName }, variants }]
    ]);
    result = generateJoinPoint({ joinPointFiles, path });
  });

  it("should return a script that imports the appropriate point cut for the join point", () => {
    expect(result).toMatch(
      `import pointCut from "${SCHEME}:${POINT_CUTS}:/${pointCutName}";`
    );
  });

  it("should return a script that imports the base / control module for the join point", () => {
    expect(result).toMatch(`import * as joinPoint from "${path}";`);
  });

  it("should return a script that imports all the valid variants of the base / control module into a webpackContext, using a minimal regex that matches all the variants", () => {
    expect(result).toMatch(
      `const variants = import.meta.webpackContext("${
        path.split("/")[0]
      }", { recursive: true, regExp: /test\\-(?:other\\-sub\\-folder\\/test\\-variant\\-1|sub\\-folder\\/test\\-variant\\-[12])/ });`
    );
  });

  it("should return a script exports a default export which calls the point cut, passing the join point (control module) and the variants", () => {
    expect(result).toMatch("export default pointCut({ joinPoint, variants });");
  });
});
