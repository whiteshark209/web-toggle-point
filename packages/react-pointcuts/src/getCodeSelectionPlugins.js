/**
 * A plugin for the point cuts package
 * @typedef {object} module:toggle-point-react-pointcuts~plugin
 * @property {string} name plugin name, used as a prefix when creating {@link https://legacy.reactjs.org/docs/higher-order-components.html|React Higher-Order-Components} when toggling
 * @property {Function} onCodeSelected hook to be called when a code selection is made
 */

const getCodeSelectionPlugins = (plugins) =>
  plugins.filter(({ onCodeSelected }) => !!onCodeSelected);

export default getCodeSelectionPlugins;
