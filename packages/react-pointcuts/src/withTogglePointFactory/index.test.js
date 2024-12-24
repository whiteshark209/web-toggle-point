import withTogglePointFactory from ".";
import { render, screen } from "@testing-library/react";
import useCodeMatches from "../useCodeMatches";
import getComponent from "./getComponent";
import getCodeSelectionPlugins from "../getCodeSelectionPlugins";
import { createRef, forwardRef } from "react";

const mockMatches = {};
jest.mock("../useCodeMatches", () => jest.fn(() => mockMatches));
const mockCodeSelectionPlugins = Symbol("test-code-selection-plugins");
jest.mock("../getCodeSelectionPlugins", () =>
  jest.fn(() => mockCodeSelectionPlugins)
);
const mockVariedComponent = "test-component";
const MockVariedComponent = forwardRef(
  jest.fn((_, ref) => <div ref={ref} data-testid={mockVariedComponent} />)
);

jest.mock("./getComponent", () => jest.fn(() => MockVariedComponent));

describe("withTogglePointFactory", () => {
  let rerender;
  const featuresMap = Symbol("test-features-map");
  const inboundProps = { "test-prop": Symbol("test-value") };
  const logError = Symbol("test-log-error");
  const mockPlugins = [Symbol("test-plugin1"), Symbol("test-plugin2")];
  const mockActiveFeatures = Symbol("test-active-features");
  const getActiveFeatures = jest.fn(() => mockActiveFeatures);

  let Toggled, variantKey;

  describe.each`
    inputVariantKey | expectedVariantKey
    ${variantKey}   | ${"bucket"}
    ${"test-key"}   | ${"test-key"}
  `(
    "when given a variant key of $inputVariantKey",
    ({ inputVariantKey, expectedVariantKey }) => {
      const makeCommonAssertions = (mockComponent) => {
        beforeEach(() => {
          mockMatches.matchedFeatures = Symbol("test-features");
          mockMatches.matchedVariant = Symbol("test-variant");
          jest.clearAllMocks();
          const withTogglePoint = withTogglePointFactory({
            getActiveFeatures,
            logError,
            variantKey: inputVariantKey,
            plugins: mockPlugins
          });
          Toggled = withTogglePoint({ default: mockComponent }, featuresMap);
        });

        it("should get code selection plugins", () => {
          expect(getCodeSelectionPlugins).toHaveBeenCalledWith(mockPlugins);
        });

        const makeRenderedAssertions = () => {
          it("should render the varied component, passing the inbound props provided to the HOC", () => {
            expect(screen.getByTestId(mockVariedComponent)).toBeInTheDocument();
            const ref = expect.toBeOneOf([null, expect.anything()]);
            expect(MockVariedComponent.render).toHaveBeenCalledWith(
              inboundProps,
              ref
            );
          });

          it("should check for code matches, based on the result of the getActiveFeatures method passed and the potential code paths on disk", () => {
            expect(useCodeMatches).toHaveBeenCalledWith({
              featuresMap,
              variantKey: expectedVariantKey,
              activeFeatures: mockActiveFeatures
            });
          });
        };

        const makeGetComponentAssertions = () => {
          it("should get a component, based on the matched features, matched variant, code require context and input component as a fallback, passing the appropriate plugins that include a code selection hook", () => {
            const { matchedFeatures, matchedVariant } = mockMatches;
            expect(getComponent).toHaveBeenCalledWith({
              matchedFeatures,
              matchedVariant,
              logError,
              control: mockComponent,
              plugins: mockCodeSelectionPlugins
            });
          });
        };

        const makeCommonAssertions = () => {
          makeRenderedAssertions();
          makeGetComponentAssertions();

          describe("when the component re-renders", () => {
            beforeEach(() => {
              getComponent.mockClear();
            });

            describe("and the matched features have updated", () => {
              beforeEach(() => {
                mockMatches.matchedFeatures = Symbol("test-new-features");
              });

              describe("and the matched variant has updated", () => {
                beforeEach(() => {
                  mockMatches.matchedVariant = Symbol("test-new-variant");
                  rerender(<Toggled {...inboundProps} />);
                });

                makeRenderedAssertions();
                makeGetComponentAssertions();
              });

              describe("and the matched variant has not updated", () => {
                beforeEach(() => {
                  rerender(<Toggled {...inboundProps} />);
                });

                makeRenderedAssertions();
                makeGetComponentAssertions();
              });
            });

            describe("and the active features have not updated", () => {
              beforeEach(() => {
                rerender(<Toggled {...inboundProps} />);
              });

              it("should not get the component again, to avoid needless re-execution", () => {
                expect(getComponent).not.toHaveBeenCalled();
              });

              makeRenderedAssertions();
            });
          });
        };

        describe("When the consumer passes a ref", () => {
          const mockRef = createRef();

          beforeEach(() => {
            ({ rerender } = render(
              <Toggled {...inboundProps} ref={mockRef} />
            ));
          });

          it("should pass the ref to the varied component", () => {
            expect(screen.getByTestId(mockVariedComponent)).toBe(
              mockRef.current
            );
          });

          makeCommonAssertions();
        });

        describe("When the consumer does not pass a ref", () => {
          beforeEach(() => {
            ({ rerender } = render(<Toggled {...inboundProps} />));
          });

          makeCommonAssertions();
        });
      };

      describe("when the given fallback component has a displayName", () => {
        const mockComponent = () => {};
        mockComponent.displayName = "test-component";

        makeCommonAssertions(mockComponent);

        it("should name the HOC with the fallback component's display name wrapped in 'withTogglePoint'", () => {
          expect(Toggled.displayName).toBe(
            `withTogglePoint(${mockComponent.displayName})`
          );
        });
      });

      describe("when the given fallback component does not have a displayName, but has a function name", () => {
        const mockComponent = () => {};

        makeCommonAssertions(mockComponent);

        it("should name the HOC with the fallback component's name wrapped in 'withTogglePoint'", () => {
          expect(Toggled.displayName).toBe(`withTogglePoint(mockComponent)`);
        });
      });

      describe("when the given fallback component does not have a displayName or a function name", () => {
        makeCommonAssertions(() => {});

        it("should name the HOC with 'Component' wrapped in 'withTogglePoint'", () => {
          expect(Toggled.displayName).toBe(`withTogglePoint(Component)`);
        });
      });
    }
  );
});
