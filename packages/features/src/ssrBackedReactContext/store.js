import { withJsonIsomorphism } from "@asos/web-toggle-point-ssr";
import reactContextFeaturesStoreFactory from "../reactContext/store";

/**
 * A factory function used to create a store for features, held in a {@link https://reactjs.org/docs/context.html|React context}, backed by server-side rendering.
 * A wrapper around a {@link module:toggle-point-features.reactContextFeaturesStore|reactContextFeaturesStore}, with server-side rendering supplied by the {@link module:toggle-point-ssr|toggle-point-ssr} package.
 * @memberof module:toggle-point-features
 * @returns {module:toggle-point-features.ssrBackedReactContextFeaturesStore} A store for features, held within a {@link https://reactjs.org/docs/context.html|React context}.
 */
const ssrBackedReactContextFeaturesStoreFactory = ({
  namespace = "toggles",
  name,
  logWarning
}) => {
  const { providerFactory, ...rest } = reactContextFeaturesStoreFactory({
    name
  });

  /**
   * @name ssrBackedReactContextFeaturesStore
   * @memberof module:toggle-point-features
   * @implements module:toggle-point-features.FeaturesStore
   * @implements module:toggle-point-features.ContextFeaturesStore
   */
  return {
    providerFactory: () => {
      const FeaturesProvider = providerFactory();
      const SSRBackedFeaturesProvider = withJsonIsomorphism(
        ({ children, [name]: value }) => (
          <FeaturesProvider value={value}>{children}</FeaturesProvider>
        ),
        logWarning,
        {
          scriptId: `${namespace}_${name}`,
          propName: name
        }
      );
      return ({ children, value }) => (
        <SSRBackedFeaturesProvider {...{ [name]: value }}>
          {children}
        </SSRBackedFeaturesProvider>
      );
    },
    ...rest
  };
};

export default ssrBackedReactContextFeaturesStoreFactory;
