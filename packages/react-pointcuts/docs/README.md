# @asos/web-toggle-point-react-pointcuts

This package provides react application pointcut code, acting as a target toggle point injected by [`@asos/web-toggle-point-webpack/plugin`](../../webpack/docs/README.md)

It contains the following exports:

- `withTogglePointFactory`

This is a factory function used to create a `withTogglePoint` [react higher-order component](https://reactjs.org/docs/higher-order-components.html).  

- `withToggledHookFactory`

This is a factory function used to create a [hook](https://reactjs.org/docs/hooks-intro.html)-wrapping function.

The product of both these factories receive the outcome of the webpack plugin, used to choose appropriate variants at runtime, based on decisions from a supplied context.  

Both accept plugins, currently supporting a hook called during code activation (mounting of the  component, or calling the hook).

## Usage

See: [JSDoc output](https://asos.github.io/web-toggle-point/module-asos-web-toggle-point-react-pointcuts.html)

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
