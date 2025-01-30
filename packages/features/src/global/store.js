const storeMap = new WeakMap();

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{}
/**
 * A factory function used to create a store for features, held globally in the application.
 * This is a singleton, and should not be used server-side for anything user or request specific.
 * A thin wrapper around a singleton, used as an extension point for future plugins.
 * Consider {@link https://github.com/christophehurpeau/deep-freeze-es6|deep freezing} the value to prevent accidental mutation, if this is intended to be static.
 * For reactive decisions, consider implementing something that allows for reactivity e.g. a {@link https://github.com/pmndrs/valtio|valtio/vanilla} proxy, and subscribe appropriately in a toggle point.
 * @memberof module:web-toggle-point-features
 * @returns {module:web-toggle-point-features.globalFeaturesStore} A store for features, held globally in the application.
 */
const globalFeaturesStoreFactory = () => {
  const identifier = Symbol();
  /**
   * @name globalFeaturesStore
   * @memberof module:web-toggle-point-features
   * @implements module:web-toggle-point-features.FeaturesStore
   * @implements module:web-toggle-point-features.SingletonFeaturesStore
   */
  return {
    useValue: ({ value }) => {
      storeMap.set(identifier, value);
    },
    getFeatures: () => storeMap.get(identifier)
  };
};

export default globalFeaturesStoreFactory;
