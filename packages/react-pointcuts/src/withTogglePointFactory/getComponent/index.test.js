import getComponent from "./index";
import withErrorBoundary from "./withErrorBoundary";
import withPlugins from "./withPlugins";
import { render, screen } from "@testing-library/react";
import { createRef, forwardRef } from "react";

jest.mock("./withErrorBoundary", () => jest.fn());
jest.mock("./withPlugins", () => jest.fn());

const mockVariantComponent = "test-variant-component";
const MockVariantComponent = forwardRef(
  jest.fn((_, ref) => <div ref={ref} data-testid={mockVariantComponent} />)
);

describe("getComponent", () => {
  let result, params;
  const pluginMarker = Symbol("test-plugin-marker");

  beforeEach(() => {
    jest.clearAllMocks();
    params = {
      logError: Symbol("test-error-logger"),
      control: () => Symbol("test-base-component"),
      plugins: Symbol("test-plugins")
    };
    withPlugins.mockImplementation(({ Component }) => {
      Component[pluginMarker] = true;
      return Component;
    });
  });

  const makeCommonAssertions = () => {
    it("should run plugins on the the matched features, passing the params that were passed to the component, in-case the plugins need them", () => {
      const { plugins, ...rest } = params;
      expect(withPlugins).toHaveBeenCalledWith({
        Component: result,
        plugins,
        ...rest
      });
      expect(result[pluginMarker]).toBe(true);
    });
  };

  const makeFallbackAssertion = () => {
    it("should return the control (base) component", () => {
      expect(result).toBe(params.control);
    });
  };

  describe("when there are no matched features", () => {
    beforeEach(() => {
      params = {
        ...params,
        matchedFeatures: [],
        matchedVariant: null
      };
      result = getComponent(params);
    });

    makeCommonAssertions();
    makeFallbackAssertion();
  });

  describe("when there are matched features", () => {
    const matchedFeatures = [Symbol("test-matched-feature")];
    beforeEach(() => {
      params = {
        ...params,
        matchedFeatures
      };
    });

    describe("and there is no matched variant", () => {
      beforeEach(() => {
        params = {
          ...params,
          matchedVariant: null
        };
        result = getComponent(params);
      });

      makeCommonAssertions();
      makeFallbackAssertion();
    });

    describe("and there is a matched variant", () => {
      const errorBoundariedMarker = Symbol("test-error-boundaried-marker");
      const innateProp = "test-innate-prop";
      const variables = {
        "test-variable-key": Symbol("test-variable-value-1"),
        [innateProp]: Symbol("test-variable-value-2")
      };

      beforeEach(() => {
        withErrorBoundary.mockImplementation(({ Variant }) => {
          Variant[errorBoundariedMarker] = true;

          return Variant;
        });
        params = {
          ...params,
          matchedVariant: {
            codeRequest: { default: MockVariantComponent },
            variables
          }
        };
        result = getComponent(params);
      });

      it("should wrap the variant with an error boundary, to ensure errors in the variant result in falling back to the base/default component", () => {
        const { control: Component } = params;
        expect(withErrorBoundary).toHaveBeenCalledWith({
          logError: params.logError,
          Variant: expect.anything(),
          fallback: Component
        });
        expect(result[errorBoundariedMarker]).toBe(true);
      });

      makeCommonAssertions();

      describe("when the returned variant is rendered", () => {
        const componentProps = {
          "test-component-prop": Symbol("test-component-prop-value"),
          [innateProp]: Symbol("test-innate-prop-value")
        };
        const mockRef = createRef();

        beforeEach(() => {
          const Component = result;
          render(<Component {...componentProps} ref={mockRef} />);
        });

        it("should return the variant, sending down any innate props, attaching the passed ref, and any variables from the feature as props (preferring innate props over variables - so features can't overwrite innate/in-built props)", () => {
          const variantElement = screen.getByTestId(mockVariantComponent);
          expect(variantElement).toBeInTheDocument();
          expect(variantElement).toBe(mockRef.current);
          expect(MockVariantComponent.render).toHaveBeenCalledWith(
            expect.objectContaining({ ...variables, ...componentProps }),
            mockRef
          );
        });
      });
    });
  });
});
