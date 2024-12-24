# Express "animals" example

This example shows the use of the [`webpack`](../../../../../packages/webpack/docs/README.md) package, as part of a simple [express](https://expressjs.com/) application.

It demonstrates how to toggle modules with a singleton lifecycle, where a toggle decision may change during their lifetime. An abstract class is extended by two variations.

It also demonstrates the addition of a toggle-specific side-effect, resulting in some basic logging when each call to a toggled method is made.

## Setup

1. install [mod header](https://modheader.com/), or some other tool for modifying request headers sent in a browser
2. `npm install`
3. `npm run start`
4. open `localhost:3002` in a browser, you should receive a `400 version header is required` response
5. add a `version` header with the value `1` or `2`
6. reload the page

## Functionality

You should see a picture of a cat or a dog, depending on the version chosen.  The contrived application uses a `streamImage` module that accesses a `urlFetcher`, which is varied by the toggle point.

The toggle point is a higher-order function to ensure that each invocation honours the toggle decision, based on current context.  As a caveat of toggling, the constructor of the `urlFetcher` must be called on each request, rather than statically enacted at application start-up.  The code demonstrates a mitigation of hypothetical cost of re-construction via use of a cache within the toggle point.
The toggle point wraps the varied modules in a [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) to add the logging side-effect.

The use of [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) allows the toggle decision to be scoped on a per-request basis, without explicit access to the express request context.  The storage is initialised within [middleware](https://expressjs.com/en/resources/middleware.html).
