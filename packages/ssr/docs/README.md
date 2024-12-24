# @asos/web-toggle-point-ssr

This package provides react application code for serializing JSON server-side and making it available as a prop client-side.

It contains the following exports:

- `withJsonIsomorphism`

This represents a [react higher-order component](https://reactjs.org/docs/higher-order-components.html) designed to serialize server state to a `<script type="application/json" />`, so it is available to a client bundle.

This code is agnostic of toggling/experiments, so is made available as an independent export, for other use cases.

- `serializationFactory`

This factory takes an `id` for the script, and a `logWarning` method (only relevant on the client, used to highlight any malformed JSON in-case this is processed outside of the SSR process).

It creates an object with these methods:

For the server:
  - `getScriptMarkup`
    - returns a `<script type="application/json">` tag, as a string, for direct inclusion in the DOM.  Uses [`jsesc`](https://github.com/mathiasbynens/jsesc/tree/main) to ensure appropriate escaping for JSON.
  - `getScriptReactElement`
    - returns a react element, wrapping the `getScriptMarkup`
    
For the browser:
  - `getJSONFromScript`
    - de-serializes the value, returning an object

## Usage

See: [JSDoc output](https://asos.github.io/web-toggle-point/module-asos-web-toggle-point-ssr.html)

> [!WARNING]
> ### Use with React 17
> The package should work with React 17 and above, but due to [a bug](https://github.com/facebook/react/issues/20235) that they are not back-filling, the use of `"type": "module"` in the package means webpack will be unable to resolve the extensionless import.
> To fix, either upgrade to React 18+ or add the following resolve configuration to the webpack config:
> ```js
> resolve: {
>   alias: {
>     "react/jsx-runtime": "react/jsx-runtime.js"
>   }
> }
> ```
