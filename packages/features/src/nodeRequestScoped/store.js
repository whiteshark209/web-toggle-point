import { AsyncLocalStorage } from "async_hooks";

/**
 * A factory function used to create a store for features, held in request-scoped global value.
 * Should only be used server-side, for anything user or request specific.
 * A thin wrapper around node {@link https://nodejs.org/api/async_context.html#class-asynclocalstorage|AsyncLocalStorage}, used as an extension point for future plugins.
 * @memberof module:toggle-point-features
 * @returns {module:toggle-point-features.requestScopedFeaturesStore} A store for features, scoped for the current request.
 */
const requestScopedFeaturesStoreFactory = () => {
  const store = new AsyncLocalStorage();

  /**
   * @name requestScopedFeaturesStore
   * @memberof module:toggle-point-features
   * @implements module:toggle-point-features.FeaturesStore
   * @implements module:toggle-point-features.SingletonFeaturesStore
   */
  return {
    useValue: ({ value, scopeCallBack }) => {
      store.run(value, scopeCallBack);
    },
    getFeatures: () => {
      const features = store.getStore();
      if (features === undefined) {
        throw Error("Called outside of request context");
      }
      return features;
    }
  };
};

export default requestScopedFeaturesStoreFactory;
