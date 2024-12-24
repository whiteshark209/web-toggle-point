import { withJsonIsomorphism } from "@asos/web-toggle-point-ssr";
import { render, screen } from "@testing-library/react";
import reactContextFeaturesStoreFactory from "../reactContext/store";
import ssrBackedReactContextFeaturesStoreFactory from "./store";

const MockSSRBackedFeaturesProvider = jest.fn(({ children }) => (
  <div data-testid="test-ssr-backed-features-provider">{children}</div>
));
jest.mock("@asos/web-toggle-point-ssr", () => ({
  withJsonIsomorphism: jest.fn(() => MockSSRBackedFeaturesProvider)
}));
const mockOtherStuff = {
  [Symbol("rest")]: Symbol("rest")
};
const mockReactContextStoreFactory = {
  providerFactory: jest.fn(),
  ...mockOtherStuff
};
jest.mock("../reactContext/store", () =>
  jest.fn(() => mockReactContextStoreFactory)
);

describe("ssrBackedReactContextFeaturesStoreFactory", () => {
  let props, result;

  beforeEach(() => {
    props = {
      name: "test-name",
      logWarning: Symbol("test-log-warning")
    };
  });

  const makeCommonAssertions = () => {
    it("should call the reactContextStoreFactory with the name", () => {
      expect(reactContextFeaturesStoreFactory).toHaveBeenCalledWith({
        name: props.name
      });
    });

    it("should return an object with a providerFactory method and whatever else the reactContextStoreFactory returns", () => {
      expect(result).toEqual({
        providerFactory: expect.any(Function),
        ...mockOtherStuff
      });
    });

    describe("when calling the providerFactory method", () => {
      let Provider;

      beforeEach(() => {
        Provider = result.providerFactory();
      });

      it("should create a reactContextStore via the reactContextStoreFactory", () => {
        expect(mockReactContextStoreFactory.providerFactory).toHaveBeenCalled();
      });

      it("should create an SSR-backed react component that serializes the provided value in a script with a namespace & named id", () => {
        expect(withJsonIsomorphism).toHaveBeenCalledWith(
          expect.any(Function),
          props.logWarning,
          {
            scriptId: expect.any(String),
            propName: props.name
          }
        );
      });

      describe("when rendering the returned component", () => {
        const value = Symbol("test-value");
        const mockChild = "test-child";
        const MockChild = () => <div data-testid={mockChild} />;
        beforeEach(() => {
          render(
            <Provider value={value}>
              <MockChild />
            </Provider>
          );
        });

        it("should pass the value to the SSR-backed component", () => {
          expect(MockSSRBackedFeaturesProvider).toHaveBeenCalledWith(
            expect.objectContaining({
              [props.name]: value
            }),
            expect.anything()
          );
        });

        it("should render the children", () => {
          expect(screen.getByTestId(mockChild)).toBeInTheDocument();
        });
      });
    });
  };

  describe("when a namespace is supplied", () => {
    beforeEach(() => {
      props = {
        ...props,
        namespace: "test-namespace"
      };
      result = ssrBackedReactContextFeaturesStoreFactory(props);
    });

    makeCommonAssertions();

    it("should create the ssr-backed component with a namespaced script id", () => {
      expect(withJsonIsomorphism).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          scriptId: `${props.namespace}_${props.name}`
        })
      );
    });
  });

  describe("when a namespace is not supplied", () => {
    beforeEach(() => {
      result = ssrBackedReactContextFeaturesStoreFactory(props);
    });

    makeCommonAssertions();

    it("should create the ssr-backed component with a default namespaced script id", () => {
      expect(withJsonIsomorphism).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          scriptId: `toggles_${props.name}`
        })
      );
    });
  });
});
