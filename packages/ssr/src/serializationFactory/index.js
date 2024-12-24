import jsesc from "jsesc";
import parse from "html-react-parser";

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{}
/**
 * A factory for creating a serialization object that has methods for serializing and deserializing JSON data in server-rendered web applications.
 * @memberof module:asos-web-toggle-point-ssr
 * @inner
 * @function
 * @memberof module:asos-web-toggle-point-ssr
 * @inner
 * @function
 * @param {object} params parameters
 * @param {string} params.id The id attribute of the backing application/json script.
 * @param {external:HostApplication.logWarning} params.logWarning A method that logs warnings; will be used when malformed JSON is found in the backing store when deserialize on the client, which should only be possible if processed in a system downstream from the origin.
 * @returns {module:asos-web-toggle-point-ssr.serialization} Some serialization / deserialization methods
 * @example
 * const logWarning = (warning) => console.log(warning);
 * const id = "app_features";
 * const { getScriptMarkup, getJSONFromScript } = serializationFactory({ id, logWarning });
 */
const serializationFactory = ({ id, logWarning }) =>
  /**
   * @typedef {function} getScriptMarkup
   * @memberof module:asos-web-toggle-point-ssr
   * @param {object} params parameters
   * @param {object} params.content The JSON content to be serialized.
   */
  /**
   * @typedef {function} getScriptReactElement
   * @memberof module:asos-web-toggle-point-ssr
   * @param {object} params parameters
   * @param {object} params.content The JSON content to be serialized.
   */
  /**
   * @typedef {function} getJSONFromScript
   * @memberof module:asos-web-toggle-point-ssr
   * @returns {object} The JSON content of the script element.
   */

  /**
   * An object containing methods for serializing and deserializing JSON data in server-rendered web applications.
   * @typedef {object} serialization
   * @memberof module:asos-web-toggle-point-ssr
   * @property {module:asos-web-toggle-point-ssr.getScriptMarkup} getScriptMarkup Gets a string containing markup for a type="application/json" script element with the specified content.
   * @property {module:asos-web-toggle-point-ssr.getScriptReactElement} getScriptReactElement - Gets a React element for a type="application/json" script element with the specified content.
   * @property {module:asos-web-toggle-point-ssr.getJSONFromScript} getJSONFromScript - Returns the JSON content of the script element.
   */
  ({
    /**
     * @memberof module:asos-web-toggle-point-ssr.serialization
     * @param {object} content The JSON content to be serialized.
     * @returns {string} A string containing markup for a type="application/json" script element with the specified content.
     */
    getScriptMarkup({ content }) {
      return `<script id="${id}" type="application/json">${jsesc(content, {
        isScriptContext: true,
        json: true
      })}</script>`;
    },
    getScriptReactElement(...args) {
      return parse(this.getScriptMarkup(...args));
    },
    getJSONFromScript() {
      const input = document.querySelector(`#${id}`)?.textContent;
      let output = null;
      try {
        output = JSON.parse(input);
      } catch {
        logWarning(`Invalid JSON found in markup: "${input}"`);
      }

      return output;
    }
  });

export default serializationFactory;
