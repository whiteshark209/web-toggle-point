import { hydrateRoot } from "react-dom/client";
import App from "./App.js";

hydrateRoot(document.body.firstChild, <App />);
