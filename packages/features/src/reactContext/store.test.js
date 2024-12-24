import reactContextStoreFactory from "./store";
import { render, screen } from "@testing-library/react";

describe("reactContextStoreFactory", () => {
  const name = "test-name";
  let reactContextStore;

  beforeEach(() => {
    reactContextStore = reactContextStoreFactory({ name });
  });

  describe("when creating a provider", () => {
    let Provider, getFeaturesResult;
    const testId = "test-id";
    const value = { [Symbol("test-key")]: Symbol("test-value") };
    const Test = () => {
      getFeaturesResult = reactContextStore.getFeatures();
      return <div data-testid={testId} />;
    };

    beforeEach(() => {
      Provider = reactContextStore.providerFactory();
      render(
        <Provider value={value}>
          <Test />
        </Provider>
      );
    });

    it("should set an appropriate display name for the provider", () => {
      expect(Provider.displayName).toBe(
        `${name[0].toUpperCase() + name.slice(1)}ToggleProvider`
      );
    });

    it("should return a defined value, so that the DOM will be reconciled", () => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("should provide the features to children of the provider, via the getFeatures method", () => {
      expect(getFeaturesResult).toBe(value);
    });
  });
});
