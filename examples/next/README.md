# Next JS example

This example shows the use of the [`react-pointcuts`](../../packages/react-pointcuts/docs/README.md), [`features`](../../packages/features/docs/README.md) and [`webpack`](../../packages/webpack/docs/README.md) packages, as part of an ["app router"](https://nextjs.org/docs/app) [Next.js](https://nextjs.org/) application.

N.B. NextJs support is currently experimental, see [caveats](#caveats).

## Setup

It is using a contrived point cut plugin, replicating an Optimizely activation handler:

```js
{
  onCodeSelected: ({ matchedFeatures }) => {
    if (matchedFeatures?.length) {
      const [[feature]] = matchedFeatures;
      console.log(
        `activated ${feature} with audience ${getFeatures().audience}`
      );
    }
  }
}
```

...which logs the activation event normally destined for the toggle router (Optimizely) to the console.

A contrived server function called `getExperiments` exists to parse inbound headers containing experiments, used to drive the toggling.

## Usage

(from the `examples/next` folder of the monorepo)

1. install [mod header](https://modheader.com/), or some other tool for modifying request headers sent in a browser
2. `npm install`
4. `npm run dev`
5. open `localhost:3000/fixtures/experiments` in a browser

See appropriate documentation within [the examples folder](./src/app/fixtures/experiments/README.md).

N.B. To confirm the `experiments` header you've set with `mod header`, you can add `?showExperiments=true` to the URL to render the value to the top of the page.
If you're not seeing the experiments header show up, try refreshing the page.  NextJs is perhaps pre-caching the pages.

## Caveats

- Only client components are supported, since request-bound context is not supported by server components.  They are not meant to be stateful.
  - API routes may be supportable, via use of [an async local storage wrapper](https://github.com/rexfordessilfie/nextwrappers/tree/main/packages/async-local-storage), once support for named exports is added ([Issue #4](https://github.com/ASOS/web-toggle-point/issues/4)) - since would need to match the HTTP verbs.
- The webpack package cannot currently vary NextJs managed files such as [pages](https://nextjs.org/docs/app/building-your-application/routing/pages) themselves, but can vary modules they import ([Issue #9](https://github.com/ASOS/web-toggle-point/issues/9)).
- The `webpack` plugin uses webpack hooks, so is incompatible with the new TurboPack bundler
- The `webpack` plugin uses Node JS APIs to access the filesystem, so may be incompatible with [the edge runtime](https://nextjs.org/docs/app/api-reference/edge#unsupported-apis).
