import requestScopedStoreFactory from "./store";
import { AsyncLocalStorage } from "async_hooks";

jest.mock("async_hooks", () => ({
  AsyncLocalStorage: jest.fn(() => ({
    run: jest.fn(),
    getStore: jest.fn()
  }))
}));

describe("store", () => {
  let requestScopedStore;

  beforeEach(() => {
    requestScopedStore = requestScopedStoreFactory();
  });

  it("should create an AsyncLocalStorage store", () => {
    expect(AsyncLocalStorage).toHaveBeenCalled();
  });

  describe("when getting a value outside the scope of a request", () => {
    it("should throw an error", () => {
      expect(() => requestScopedStore.getFeatures()).toThrow(
        "Called outside of request context"
      );
    });
  });

  describe("when using a value", () => {
    const value = Symbol("test-value");
    const scopeCallBack = Symbol("test-callback");

    beforeEach(() => {
      requestScopedStore.useValue({ value, scopeCallBack });
    });

    it("should scope the value to the descendants of the callback, by running it in the local storage", () => {
      expect(
        AsyncLocalStorage.mock.results.pop().value.run
      ).toHaveBeenCalledWith(value, scopeCallBack);
    });

    describe("when getting the features", () => {
      const returnedValue = Symbol("test-value");
      beforeEach(() => {
        AsyncLocalStorage.mock.results
          .pop()
          .value.getStore.mockReturnValue(returnedValue);
      });

      it("should return the value scoped to the current request", () => {
        expect(requestScopedStore.getFeatures()).toEqual(returnedValue);
      });
    });
  });
});
