import globalFeaturesStoreFactory from "./store";

describe("globalFeaturesStoreFactory", () => {
  let featuresStoreFactory;

  beforeEach(() => {
    featuresStoreFactory = globalFeaturesStoreFactory();
  });

  describe("when using a value", () => {
    const value = Symbol("test-value");

    beforeEach(() => {
      featuresStoreFactory.useValue({ value });
    });

    it("should store the value for later retrieval", () => {
      expect(featuresStoreFactory.getFeatures()).toBe(value);
    });

    describe("when using a different value", () => {
      const differentValue = Symbol("different-value");

      beforeEach(() => {
        featuresStoreFactory.useValue({ value: differentValue });
      });

      it("should store the new value for later retrieval", () => {
        expect(featuresStoreFactory.getFeatures()).toBe(differentValue);
      });
    });

    describe("when constructing a new store", () => {
      let newFeaturesStoreFactory;

      beforeEach(() => {
        newFeaturesStoreFactory = globalFeaturesStoreFactory();
      });

      it("should not share the value with the new store", () => {
        expect(newFeaturesStoreFactory.getFeatures()).toBeUndefined();
      });

      it("should still have the original value in the first store", () => {
        expect(featuresStoreFactory.getFeatures()).toBe(value);
      });
    });
  });
});
