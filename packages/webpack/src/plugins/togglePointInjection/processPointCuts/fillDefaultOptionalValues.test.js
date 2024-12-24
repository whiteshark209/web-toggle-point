import fillPointCutDefaults from "./fillDefaultOptionalValues";

describe("fillDefaultOptionalValues", () => {
  let result;

  const makeDefaultJoinPointResolverAssertions = () => {
    describe("when the joinPointResolver is called", () => {
      it("should return a path that is the same as the variantPath, but with the last 3 directories removed", () => {
        const variantPath =
          "/test-folder/test-sub-folder/test-sub-folder/test-sub-folder/test-variant";
        const joinPointPath = result.joinPointResolver(variantPath);
        expect(joinPointPath).toEqual("/test-folder/test-variant");
      });
    });
  };

  describe("when the point cut has no variantGlob or joinPointResolver", () => {
    const pointCut = {};

    beforeEach(() => {
      result = fillPointCutDefaults(pointCut);
    });

    it("should fill the defaults", () => {
      expect(result).toEqual({
        variantGlob: "./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}",
        joinPointResolver: expect.any(Function)
      });
    });

    makeDefaultJoinPointResolverAssertions();
  });

  describe("when the point cut has a variantGlob but no joinPointResolver", () => {
    const pointCut = { variantGlob: Symbol("test-variant-glob") };

    beforeEach(() => {
      result = fillPointCutDefaults(pointCut);
    });

    it("should fill the defaults", () => {
      expect(result).toEqual({
        variantGlob: pointCut.variantGlob,
        joinPointResolver: expect.any(Function)
      });
    });

    makeDefaultJoinPointResolverAssertions();
  });

  describe("when the point cut has a joinPointResolver but no variantGlob", () => {
    it("should return the supplied joinPointResolver and fill a default variantGlob", () => {
      const pointCut = {
        joinPointResolver: Symbol("test-join-point-resolver")
      };
      const result = fillPointCutDefaults(pointCut);
      expect(result).toEqual({
        variantGlob: "./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}",
        joinPointResolver: pointCut.joinPointResolver
      });
    });
  });

  describe("when the point cut has a variantGlob and a joinPointResolver", () => {
    it("should return the point cut supplied values", () => {
      const pointCut = {
        variantGlob: Symbol("test-variant-glob"),
        joinPointResolver: Symbol("test-join-point-resolver")
      };
      const result = fillPointCutDefaults(pointCut);
      expect(result).toEqual(pointCut);
    });
  });
});
