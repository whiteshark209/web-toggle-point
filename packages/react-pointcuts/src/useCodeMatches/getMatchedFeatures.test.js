import getMatchedFeatures from "./getMatchedFeatures";

describe("getMatchedFeatures", () => {
  let result;

  const feature1 = "test-feature-1";
  const feature2 = "test-feature-2";
  const featuresMap = new Map([
    [feature1, Symbol("test-decision-outcome-1")],
    [feature2, Symbol("test-decision-outcome-3")]
  ]);

  describe("when there are active features", () => {
    const activeFeatures = {
      [feature1]: featuresMap.get(feature1),
      "test-unrelated-optimizely-feature": Symbol("test-decision-outcome-2"),
      [feature2]: featuresMap.get(feature2)
    };
    const expectation = [
      [feature1, activeFeatures[feature1]],
      [feature2, activeFeatures[feature2]]
    ];

    beforeEach(() => {
      result = getMatchedFeatures({ activeFeatures, featuresMap });
    });

    it("should return those features that are in the features map", () => {
      expect(result).toEqual(expectation);
    });
  });

  describe("when there are no active features", () => {
    beforeEach(() => {
      result = getMatchedFeatures({ activeFeatures: {}, featuresMap });
    });

    it("should return no matches", () => {
      expect(result).toEqual([]);
    });
  });

  describe("when active features could not be gleaned", () => {
    beforeEach(() => {
      result = getMatchedFeatures({ activeFeatures: null, featuresMap });
    });

    it("should return no matches", () => {
      expect(result).toEqual([]);
    });
  });
});
