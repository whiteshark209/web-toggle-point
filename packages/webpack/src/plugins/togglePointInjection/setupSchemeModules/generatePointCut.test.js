import generatePointCut from "./generatePointCut.js";

describe("generatePointCut", () => {
  const pointCutName = "test-point-cut";
  const path = `/${pointCutName}`;
  const togglePointModule = "test-toggle-point-path";
  let result, pointCuts;

  beforeEach(() => {
    pointCuts = [
      { name: "test-other-point-cut" },
      { name: pointCutName, togglePointModule }
    ];
  });

  const makeCommonAssertions = () => {
    it("should return a script that imports the appropriate toggle point", () => {
      expect(result).toMatch(`import togglePoint from "${togglePointModule}";`);
    });

    it("should return a script exports a default export which calls the toggle handler, passing the toggle point and any other properties of the first argument given to it", () => {
      expect(result).toMatch(
        "export default (rest) => handler({ togglePoint, ...rest });"
      );
    });
  };

  describe("when a toggle handler is configured against the point cut", () => {
    const toggleHandler = "test-toggle-handler";

    beforeEach(() => {
      pointCuts[1].toggleHandler = toggleHandler;
      result = generatePointCut({ pointCuts, path });
    });

    it("should return a script that imports the appropriate toggle handler", () => {
      expect(result).toMatch(`import handler from "${toggleHandler}";`);
    });

    makeCommonAssertions();
  });

  describe("when a toggle handler is not configured against the point cut", () => {
    beforeEach(() => {
      result = generatePointCut({ pointCuts, path });
    });

    it("should return a script that imports the default toggle handler (a path segment toggle handler)", () => {
      expect(result).toMatch(
        `import handler from "@asos/web-toggle-point-webpack/pathSegmentToggleHandler";`
      );
    });

    makeCommonAssertions();
  });
});
