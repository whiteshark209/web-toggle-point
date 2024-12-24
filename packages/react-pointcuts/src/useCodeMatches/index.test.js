import useCodeMatches from ".";
import { renderHook } from "@testing-library/react";
import getMatchedVariant from "./getMatchedVariant";
import getMatchedFeatures from "./getMatchedFeatures";

const mockMatchedVariant = Symbol("test-matched-variant");
jest.mock("./getMatchedVariant", () => jest.fn(() => mockMatchedVariant));
const mockMatchedFeatures = Symbol("test-matched-features");
jest.mock("./getMatchedFeatures", () => jest.fn(() => mockMatchedFeatures));

describe("useCodeMatches", () => {
  let result, rerender;
  const featuresMap = Symbol("test-features-map");
  let activeFeatures;

  beforeEach(() => {
    activeFeatures = { ["test-feature"]: "test-value" };
    ({ result, rerender } = renderHook(useCodeMatches, {
      initialProps: {
        activeFeatures,
        featuresMap
      }
    }));
  });

  const makeCommonAssertions = () => {
    it("should return the matched features and matched variant", () => {
      expect(result.current).toEqual({
        matchedFeatures: mockMatchedFeatures,
        matchedVariant: mockMatchedVariant
      });
    });
  };

  const makeNewActiveFeaturesAssertions = () => {
    it("should get the matched features, based on the active features and features map", () => {
      expect(getMatchedFeatures).toHaveBeenCalledWith({
        activeFeatures,
        featuresMap
      });
    });

    it("should get the matched variant, based on the matched features and features map", () => {
      expect(getMatchedVariant).toHaveBeenCalledWith({
        matchedFeatures: mockMatchedFeatures,
        featuresMap
      });
    });
  };

  makeCommonAssertions();
  makeNewActiveFeaturesAssertions();

  describe("when the active features change", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      activeFeatures = { ["test-new-feature"]: "test-value" };
      rerender({ featuresMap, activeFeatures });
    });

    makeCommonAssertions();
    makeNewActiveFeaturesAssertions();
  });

  describe("when re-rendering without an active features change", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      rerender({ featuresMap, activeFeatures });
    });

    makeCommonAssertions();

    it("should not get new matches, to avoid needlessly creating a new variant, which could cause re-renders", () => {
      expect(getMatchedFeatures).not.toHaveBeenCalled();
      expect(getMatchedVariant).not.toHaveBeenCalled();
    });
  });
});
