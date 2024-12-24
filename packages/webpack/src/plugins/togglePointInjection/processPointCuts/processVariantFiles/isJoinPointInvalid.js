import { TOGGLE_CONFIG } from "../../constants";
import { promisify } from "util";
import { join } from "path";
import validateConfigSchema from "./validateConfigSchema";

const readFile = ({ fileSystem: { readFile }, path }) =>
  promisify(readFile)(path, "utf-8");

const fileExists = async (fileSystem, path) => {
  const stat = promisify(fileSystem.stat);
  try {
    return (await stat(path)).isFile();
  } catch {} // eslint-disable-line no-empty
  return false;
};

const ensureConfigFile = async ({
  configFiles,
  fileSystem,
  joinDirectory,
  appRoot
}) => {
  if (!configFiles.has(joinDirectory)) {
    let configFile = null;
    const path = `${join(appRoot, joinDirectory, TOGGLE_CONFIG)}`;
    if (await fileExists(fileSystem, path)) {
      configFile = JSON.parse(await readFile({ fileSystem, path }));
      validateConfigSchema({ configFile, appRoot, path });
    }
    configFiles.set(joinDirectory, configFile);
  }
};

const isJoinPointInvalid = async ({
  configFiles,
  name,
  fileSystem,
  appRoot,
  joinPointPath,
  joinDirectory
}) => {
  await ensureConfigFile({ configFiles, fileSystem, joinDirectory, appRoot });

  if (configFiles.has(joinDirectory)) {
    if (configFiles.get(joinDirectory)?.joinPoints.includes(name) === false) {
      return true;
    }
  }

  if (!(await fileExists(fileSystem, join(appRoot, joinPointPath)))) {
    return true;
  }

  return false;
};

export default isJoinPointInvalid;
