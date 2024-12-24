import { PLUGIN_NAME } from "../../../constants";
import { relative } from "path";
import { validate } from "schema-utils";
import configSchema from "./configSchema.json";

const validateConfigSchema = ({ configFile, appRoot, path }) => {
  const description = "toggle config";
  validate(configSchema, configFile, {
    name: PLUGIN_NAME,
    baseDataPath: description,
    postFormatter: (formattedError) =>
      formattedError.replace(description, relative(appRoot, path))
  });
};

export default validateConfigSchema;
