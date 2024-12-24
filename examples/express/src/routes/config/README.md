# Express "config" example

This example shows the use of the [`react-pointcuts`](../../../../../packages/react-pointcuts/docs/README.md), [`features`](../../../../../packages/features/docs/README.md), [`ssr`](../../../../../packages/ssr/docs/README.md) and [`webpack`](../../../../../packages/webpack/docs/README.md) packages, as part of a simple [express](https://expressjs.com/) application, contriving a scenario where an `.env` is used to configure an application, with toggles responding to the setup.

It demonstrates the use of the `ssrBackedReactContext` features store, as exported by the `features` package, which utilises the [`ssr`](../../../../../packages/ssr/docs/README.md) package to render server context to a client bundle, supporting state mirrored in the node process and a client react application.

It shows how a payload can be included in the props passed to the toggle point created by the `features` package - a `backgroundColor` prop is passed to a variant when active.

N.B. No implication that this is in any way a _good use_ of "config", it's heavily contrived.

## Setup

1. `npm install`
2. `npm run start`
3. open `localhost:3002/config` in a browser, you should see a medium sized div
4. stop, and re-start the server with `npm run start:small-env` or `npm run start:large-env`
5. open `localhost:3003/config` (small env) or `localhost:3004/config` (large env), and see a different sized (and coloured) `div` shown
6. press the buttons, to demonstrate overriding the initial content serialized on the server.
   - N.B. The colourisation is only a result of the stored config, so using the buttons will just change the size
