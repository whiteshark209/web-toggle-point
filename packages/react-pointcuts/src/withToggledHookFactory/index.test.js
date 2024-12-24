import withToggledHookFactory from ".";
import getCodeSelectionPlugins from "../getCodeSelectionPlugins";
import pluginsHookFactory from "./pluginsHookFactory";
import { renderHook } from "@testing-library/react";
import useCodeMatches from "../useCodeMatches";

const mockMatches = { matchedFeatures: Symbol("test-matched-features") };
jest.mock("../useCodeMatches", () => jest.fn(() => mockMatches));
const mockCodeSelectionPlugins = Symbol("test-code-selection-plugins");
jest.mock("../getCodeSelectionPlugins", () =>
  jest.fn(() => mockCodeSelectionPlugins)
);
jest.mock("./pluginsHookFactory", () => jest.fn());

describe("withToggledHookFactory", () => {
  let result, toggledHook;

  const mockControlHook = jest.fn();
  const featuresMap = Symbol("test-features-map");
  const mockPlugins = [Symbol("test-plugin1"), Symbol("test-plugin2")];
  const initialProps = Symbol("test-arg");
  const mockActiveFeatures = Symbol("test-active-features");
  const getActiveFeatures = jest.fn(() => mockActiveFeatures);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("../useCodeMatches", () => jest.fn(() => mockMatches));
    const withToggledHook = withToggledHookFactory({
      getActiveFeatures,
      plugins: mockPlugins
    });
    toggledHook = withToggledHook({ default: mockControlHook }, featuresMap);
  });

  it("should get code selection plugins", () => {
    expect(getCodeSelectionPlugins).toHaveBeenCalledWith(mockPlugins);
  });

  it("should create a code selection hook based on the appropriate plugins", () => {
    expect(pluginsHookFactory).toHaveBeenCalledWith(mockCodeSelectionPlugins);
  });

  const makeCommonAssertions = (extraCommonAssertions) => {
    const makeCommonAssertions = () => {
      it("should get active features", () => {
        expect(getActiveFeatures).toHaveBeenCalled();
      });

      it("should get code matches", () => {
        expect(useCodeMatches).toHaveBeenCalledWith({
          featuresMap,
          activeFeatures: mockActiveFeatures
        });
      });

      extraCommonAssertions?.();
    };

    describe("when a variant matches the active features", () => {
      const output = Symbol("test-hook-output");
      const variant = jest.fn(() => output);

      beforeEach(() => {
        mockMatches.matchedVariant = {
          codeRequest: {
            default: variant
          }
        };
        ({ result } = renderHook(toggledHook, {
          initialProps
        }));
      });

      it("should call and return the output of the matched variant", () => {
        expect(variant).toHaveBeenCalledWith(initialProps);
        expect(result.current).toBe(output);
      });

      it("should not call the fallback (control) hook", () => {
        expect(mockControlHook).not.toHaveBeenCalled();
      });

      makeCommonAssertions();
    });

    describe("when a variant doesn't match the active features", () => {
      const output = Symbol("test-hook-output");

      beforeEach(() => {
        mockMatches.matchedVariant = null;
        mockControlHook.mockReturnValueOnce(output);
        ({ result } = renderHook(toggledHook, { initialProps }));
      });

      it("should call and return the output of the fallback (control) hook", () => {
        expect(mockControlHook).toHaveBeenCalledWith(initialProps);
        expect(result.current).toBe(output);
      });

      makeCommonAssertions();
    });
  };

  describe("when there are some code selection plugins", () => {
    const mockPluginsHook = jest.fn();

    beforeEach(() => {
      mockMatches.matchedVariant = {
        codeRequest: {
          default: jest.fn()
        }
      };
      pluginsHookFactory.mockReturnValueOnce(mockPluginsHook);
      ({ result } = renderHook(toggledHook));
    });

    makeCommonAssertions(() => {
      it("should call the plugins hook with the code matches", () => {
        expect(mockPluginsHook).toHaveBeenCalledWith(initialProps);
      });
    });
  });

  describe("when there are no code selection plugins", () => {
    beforeEach(() => {
      pluginsHookFactory.mockReturnValueOnce(pluginsHookFactory);
    });

    makeCommonAssertions();
  });
});
