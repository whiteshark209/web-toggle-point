import globals from "globals";
import index from "./index.js";

export default [
  ...index,
  {
    name: "asosconfig/server",
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
