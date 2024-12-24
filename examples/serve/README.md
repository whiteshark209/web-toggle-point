# Serve example

## Setup

This example shows the use of [`webpack`](../../packages/webpack/docs/README.md) and [`features`](../../packages/features/docs/README.md) packages, as part of a simple [serve](https://github.com/vercel/serve) fully client-rendered application.

It uses a `globalFeaturesStoreFactory` from the `features` package, to hold a invariant global toggle state.

It demonstrates a setup that utilises the `toggleHandler`, `variantGlob`, and `controlResolver` options of the Webpack plugin, with some basic convention-based filesystem approaches to toggling:

1. selecting a translations JSON file based on [`navigator.language`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).
    - This uses language files stored at:
      - `/src/fixtures/translation/languages/translations.json` (default)
      - `/src/fixtures/translation/languages/de/translations.json` (variant)
      - `/src/fixtures/translation/languages/pt-BR/translations.json` (variant)
    - This uses a `joinPointGlob` setting that points to a single file, rather than attempting to match in sub-directories.
    - This uses a bespoke toggle handler to match the language to the path.
2. selecting a site-specific method, based on a site prefix of the url.
    - This uses modules stored at:
      - `/src/fixtures/config/somethingSiteSpecific.js` (default)
      - `/src/fixtures/config/sites/it,es/somethingSiteSpecific.js` (variant)
      - `/src/fixtures/config/sites/it,es/sites/it/somethingSiteSpecific.js` (variant)
      - `/src/fixtures/config/subpath/sites/us,de,fr/somethingSiteSpecific.js` (variant)
    - This uses a bespoke toggle handler to match the language to the path, which has a comma-separated form to define matches.
    - It demonstrates the ability to vary an already varied component (the Italian site is varying a file already varied for the Italian and Spanish site).
      - The second variant is importing its control, demonstrating the ability to extend a base module.
3. selecting an cohort-specific method, based on an audience cookie.
    - This uses modules stored at:
      - `/src/fixtures/audience/control-experience.js` (default)
      - `/src/fixtures/audience/cohort-1/bespoke-experience.js` (variant)
      - `/src/fixtures/audience/cohort-2/bespoke-experience.js` (variant)
    - This uses a bespoke `controlResolver` which matches an alternate file name for the default to the variants.
    - This uses a bespoke toggle handler which has no parent folder for variant folders, which are matched using a naming convention in the glob.
4. selecting a theme-specific method, based on a date
    - This uses modules stored at:
      - `/src/fixtures/event/theme.css` (default)
      - `/src/fixtures/event/theme.halloween.css` (variant)
      - `/src/fixtures/event/theme.pride.css` (variant)
      - `/src/fixtures/event/theme.st-patrick's-day.css` (variant)
    - This uses a bespoke `controlResolver` which matches an alternate file name for the default to the variants.
    - This uses a bespoke toggle handler which unpicks the filename rather than the path to match the event.
    - This demonstrates toggling a `.css` file (reliant on the webpack `css-loader` etc.)
      - N.B. Since the toggle point can currently only handle `default` exports (see [issue #4](https://github.com/ASOS/web-toggle-point/issues/4)), disabling the `namedExports` option of the css modules setup is required.

All fall back to the default if no variant matches.

## Usage

1. `npm install`
2. `npm run build`
3. `npm run start`
4. open `localhost:3001` in a browser
   - you should see the following (if you have neither of German or Brazilian Portuguese selected as your preferred language in your browser):

      ```html
      Some translated content: english value
      Some site-specific content: this is a default value
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for the default experience
      Some event-themed content
      ```

5. (in chrome) open `chrome://settings/?search=lang` and add one of `Portuguese (Brazil)` or `German` to your preferred languages, and move that to the no 1. position.
6. re-load `localhost:3000`
   - you should see the following (in Portuguese example):

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a default value
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for the default experience
      Some event-themed content
      ```

7. now open `localhost:3000/es`
    - you should see the following:

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a value for the it and es sites
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for the default experience
      Some event-themed content
      ```

8. now open `localhost:3000/it`
    - you should see the following:

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a value for the it and es sites, extended for the it site
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for the default experience
      Some event-themed content
      ```

9. now open `localhost:3000/us` or `localhost:3000/de` or `localhost:3000/fr`
    - you should see the following:

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a default value
      Some more site-specific content: this is a value for subpath for the us, de and fr sites
      Some audience-specific content: this is a value for the default experience
      Some event-themed content
      ```

10. set a cookie for an audience to either of `cohort-1` or `cohort-2` using `document.cookie = "audience=cohort-1"`
11. now open `localhost:3000/`
    - you should see the following (in cohort-1 example):

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a default value
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for cohort 1
      Some event-themed content
      ```

12. change the system date to either 5th July 2025, 31st October or 17th March.
13. now open `localhost:3000/`
    - you should see the following:

      ```html
      Some translated content: valor brasileiro
      Some site-specific content: this is a default value
      Some more site-specific content: this is a default value from subpath
      Some audience-specific content: this is a value for cohort 1
      Some event-themed content
      ```

      ...with `Some event-themed content` styled appropriately.
