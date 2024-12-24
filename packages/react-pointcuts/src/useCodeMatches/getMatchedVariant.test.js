import getMatchedVariant from "./getMatchedVariant";

describe("getMatchedVariant", () => {
  const feature1 = "test-feature-1";
  const feature2 = "test-feature-2";
  const bucket1 = "test-bucket-1";
  const bucket2 = "test-bucket-2";
  const variantKey = "bucket";
  const featuresMap = new Map([
    [feature1, new Map([[bucket2, Symbol("test-feature1-bucket2-module")]])],
    [
      feature2,
      new Map([
        [bucket1, Symbol("test-feature2-bucket1-module")],
        [bucket2, Symbol("test-feature2-bucket2-module")]
      ])
    ]
  ]);

  describe("when there are matched features", () => {
    const variables = {
      [Symbol("test-key-1")]: Symbol("test-value"),
      [Symbol("test-key-2")]: Symbol("test-value")
    };

    describe("when there are matching variants", () => {
      const feature3 = "test-feature-3";

      const matchedFeatures = [
        [feature1, { bucket: bucket1 }],
        [feature1, { bucket: bucket2, ...variables }],
        [feature3, { bucket: bucket1 }]
      ];

      it("should return the first matching variant where a folder and file match exists in the features map, and return the code request, and the associated variables from the matched features", () => {
        expect(
          getMatchedVariant({ matchedFeatures, featuresMap, variantKey })
        ).toEqual({
          codeRequest: featuresMap.get(feature1).get(bucket2),
          variables
        });
      });
    });

    describe("when there are no matching variants", () => {
      const feature1 = "test-unsupported-feature";
      const feature2 = "test-unrelated-feature";
      const matchedFeatures = [
        [feature1, { bucket: bucket2, ...variables }],
        [feature2, { bucket: bucket1 }]
      ];

      it("should return null", () => {
        expect(
          getMatchedVariant({ matchedFeatures, featuresMap, variantKey })
        ).toBeNull();
      });
    });
  });

  describe("when there are no matched features", () => {
    it("should return null", () => {
      expect(
        getMatchedVariant({ matchedFeatures: [], featuresMap })
      ).toBeNull();
    });
  });
});
