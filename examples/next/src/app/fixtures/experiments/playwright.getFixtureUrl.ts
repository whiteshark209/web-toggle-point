import { dirname, sep } from "path";
import { fileURLToPath } from "url";

const getFixtureURL = (url) => {
  const [, suffix] = dirname(fileURLToPath(url)).split(`fixtures${sep}`);
  return suffix.replace(sep, "/");
};

export default getFixtureURL;
