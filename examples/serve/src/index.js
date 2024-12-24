const appendText = (text, className = "") => {
  const element = document.createElement("div");
  element.innerText = text;
  element.className = className;
  document.body.appendChild(element);
};

import translations from "./fixtures/translation/translations.json";
import siteSpecific1 from "./fixtures/config/somethingSiteSpecific.js";
import siteSpecific2 from "./fixtures/config/subpath/somethingSiteSpecific.js";
import audienceSpecific from "./fixtures/audience/control-experience.js";
import styles from "./fixtures/event/theme.css";

appendText("Some translated content: " + translations.message);
appendText("Some site-specific content: " + siteSpecific1());
appendText("Some more site-specific content: " + siteSpecific2());
appendText("Some audience-specific content: " + audienceSpecific());
appendText("Some event-themed content", styles.theme);
