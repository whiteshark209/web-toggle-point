import globals from "globals";
import index from "./index.js";

export default [
  ...index,
  {
    name: "asosconfig/browser",
    languageOptions: {
      globals: {
        ...globals.browser,
        asos: "writable",
        __webpack_public_path__: "writable"
      }
    }
  }
];
