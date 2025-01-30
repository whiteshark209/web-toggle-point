import serializationFactory from "../serializationFactory";
import { useState, useEffect } from "react";

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{}
/**
 * A React Higher-Order-Component that allows serializing data during server-side rendering, via a preceding "application/json" script,
 * which are then realised into a prop when first hydrating on the client. It will be reactive to subsequent non-`undefined` prop values,
 * for that prop.
 * The package "browser" export includes the code to read the script, omitted from the "import" / "require" export (server package).
 * @memberof module:web-toggle-point-ssr
 * @inner
 * @function
 * @param {external:React.Component} WrappedComponent The React component that will receive the props.
 * @param {external:HostApplication.logWarning} logWarning a method that logs warnings; will be used when malformed JSON is found in the backing store.
 * @param {object} params parameters
 * @param {string} params.scriptId The id attribute of the backing application/json script.
 * @param {string} params.propName The name of the prop to inject into the wrapped React component.
 * @returns {external:React.Component} Wrapped react component.
 * @example
 * const logWarning = (warning) => console.log(warning);
 * const scriptId = "app_features";
 * const propName = "features";
 * export default withJsonIsomorphism(MyReactComponent, logWarning, { scriptId, propName });
 */
const withJsonIsomorphism = (
  WrappedComponent,
  logWarning,
  { scriptId, propName }
) => {
  const serialization = serializationFactory({ id: scriptId, logWarning });
  const WithJsonIsomorphism = ({ [propName]: value, ...rest }) => {
    const [state, setState] = useState(() => {
      if (!CLIENT) {
        return value;
      }
      return serialization.getJSONFromScript();
    });

    useEffect(() => {
      if (value !== undefined) {
        setState(value);
      }
    }, [state, value]);

    return (
      <>
        {serialization.getScriptReactElement({
          content: state ?? null
        })}
        <WrappedComponent {...{ [propName]: state, ...rest }} />
      </>
    );
  };

  return WithJsonIsomorphism;
};

export default withJsonIsomorphism;
