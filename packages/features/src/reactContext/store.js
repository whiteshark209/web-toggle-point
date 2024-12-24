import { useContext, createContext } from "react";
import PropTypes from "prop-types";

/**
 * A factory function used to create a store for features, held in a {@link https://reactjs.org/docs/context.html|React context}.
 * A thin wrapper around a context, used as an extension point for future plugins.
 * @memberof module:toggle-point-features
 * @returns {module:toggle-point-features.reactContextFeaturesStore} A store for features, held within a {@link https://reactjs.org/docs/context.html|React context}.
 */
const reactContextFeaturesStoreFactory = ({ name }) => {
  const context = createContext();

  /**
   * @name reactContextFeaturesStore
   * @memberof module:toggle-point-features
   * @implements module:toggle-point-features.FeaturesStore
   * @implements module:toggle-point-features.ContextFeaturesStore
   */
  return {
    providerFactory: () => {
      const Provider = ({ children, value }) => (
        <context.Provider value={value}>{children}</context.Provider>
      );
      Provider.propTypes = {
        children: PropTypes.node.isRequired,
        value: PropTypes.object.isRequired
      };
      Provider.displayName = `${name[0].toUpperCase() + name.slice(1)}ToggleProvider`;
      return Provider;
    },
    getFeatures: useContext.bind(undefined, context)
  };
};

export default reactContextFeaturesStoreFactory;
