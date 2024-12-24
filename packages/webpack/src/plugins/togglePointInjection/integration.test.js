import { build } from "webpack-test-utils";
import { readFile } from "fs/promises";
import { resolve } from "path";
import TogglePointInjection from "./index.js";
import { PLUGIN_NAME } from "./constants.js";

describe("togglePointInjection", () => {
  let plugin, fileSystem, built;

  const baseModuleOutput = "test-output-1";
  const variantModuleOutput = "test-output-2";
  const testFeature = "test-feature";
  const testVariant = "test-variant";
  const variantsFolder = "__variants__";
  const modulesFolder = "/src/modules/";
  const togglePointModule1 = "/src/togglePointTarget1";
  const togglePointModule2 = "/src/togglePointTarget2";
  const testCases = [
    {
      name: "not react hooks",
      togglePointModule: togglePointModule1,
      variantGlob: `${modulesFolder}**/${variantsFolder}/*/*/!(*use)*.js`,
      moduleName: "testModule.js"
    },
    {
      name: "react hooks",
      togglePointModule: togglePointModule2,
      variantGlob: `${modulesFolder}**/${variantsFolder}/*/*/use*.js`,
      moduleName: "useTestModule.js"
    }
  ];

  beforeEach(async () => {
    fileSystem = {
      "node_modules/@asos/web-toggle-point-webpack/pathSegmentToggleHandler":
        await readFile(
          resolve(
            __dirname,
            "..",
            "..",
            "toggleHandlers",
            "pathSegmentToggleHandler.js"
          ),
          "utf8"
        )
    };
  });

  const getLogOfType = (type) =>
    built.stats.compilation.logging
      .get(PLUGIN_NAME)
      .find((log) => log.type === type)?.args[0];

  describe("when a module is toggled and no matching variant exists", () => {
    beforeEach(async () => {
      plugin = new TogglePointInjection({
        pointCuts: testCases.map(({ moduleName, ...rest }) => rest) // eslint-disable-line no-unused-vars
      });
      const [{ moduleName }] = testCases;
      built = await build(
        {
          ...fileSystem,
          "/src/index.js": `export { default } from "${modulesFolder}${moduleName}";`,
          [`${togglePointModule1}.js`]:
            "export default (joinPointModule, featuresMap) => ({ joinPointModule, featuresMap })",
          [`${modulesFolder}${variantsFolder}/${testFeature}/${testVariant}/not-matching-name.js`]: `export default "${variantModuleOutput}";`,
          [`${modulesFolder}${moduleName}`]: `export default "${baseModuleOutput}";`
        },
        (config) => {
          config.plugins.push(plugin);
        }
      );
    });

    it("should return the join point module output", async () => {
      const result = built.require("/dist/index.js");
      expect(result).toEqual(baseModuleOutput);
    });
  });

  describe.each(testCases)(
    "when a module is toggled and a matching variant exists",
    ({ name, togglePointModule, moduleName }) => {
      plugin = new TogglePointInjection({
        pointCuts: testCases.map(({ moduleName, ...rest }) => rest) // eslint-disable-line no-unused-vars
      });
      beforeEach(async () => {
        built = await build(
          {
            ...fileSystem,
            "/src/index.js": `export { default } from "${modulesFolder}${moduleName}";`,
            [`${togglePointModule}.js`]:
              "export default (joinPointModule, featuresMap) => ({ joinPointModule, featuresMap })",
            [`${modulesFolder}${variantsFolder}/${testFeature}/${testVariant}/${moduleName}`]: `export default "${variantModuleOutput}";`,
            [`${modulesFolder}${moduleName}`]: `export default "${baseModuleOutput}";`
          },
          (config) => {
            config.plugins.push(plugin);
          }
        );
      });

      it("should log the fact that the toggle point was found", () => {
        expect(getLogOfType("info")).toEqual(
          `Identified '${name}' point cut for join point '${modulesFolder}${moduleName}' with potential variants:\n./${variantsFolder}/${testFeature}/${testVariant}/${moduleName}`
        );
      });

      it("should pass the toggled base module and a Map containing the matched variant to the module at the togglePointModule", () => {
        const result = built.require("/dist/index.js");
        expect(result).toMatchObject({
          joinPointModule: {
            default: baseModuleOutput
          },
          featuresMap: expect.anything() // jest doesn't have a built-in way to check if an object is a Map
        });
        const { featuresMap } = result;
        expect(featuresMap.has(testFeature)).toBe(true);
        expect(featuresMap.get(testFeature).has(testVariant)).toBe(true);
        expect(featuresMap.get(testFeature).get(testVariant)).toMatchObject({
          default: variantModuleOutput
        });
      });
    }
  );

  describe("when a module is toggled and a matching variant exists, but a join point config excludes the match", () => {
    beforeEach(async () => {
      plugin = new TogglePointInjection({
        pointCuts: testCases.map(({ moduleName, ...rest }) => rest) // eslint-disable-line no-unused-vars
      });
      const [{ moduleName }] = testCases;
      built = await build(
        {
          ...fileSystem,
          "/src/index.js": `export { default } from "${modulesFolder}${moduleName}";`,
          [`${modulesFolder}__toggleConfig.json`]: JSON.stringify({
            joinPoints: []
          }),
          [`${togglePointModule1}.js`]:
            "export default (joinPointModule, featuresMap) => ({ joinPointModule, featuresMap })",
          [`${modulesFolder}${variantsFolder}/${testFeature}/${testVariant}/${moduleName}`]: `export default "${variantModuleOutput}";`,
          [`${modulesFolder}${moduleName}`]: `export default "${baseModuleOutput}";`
        },
        (config) => {
          config.plugins.push(plugin);
        }
      );
    });

    it("should return the join point module output", async () => {
      const result = built.require("/dist/index.js");
      expect(result).toEqual(baseModuleOutput);
    });
  });

  describe("when a module is toggled and a matching variant exists, but a prior join point also matches", () => {
    const [{ moduleName }] = testCases;

    beforeEach(async () => {
      testCases[1].variantGlob = `${modulesFolder}**/${variantsFolder}/*/*/*.js`;
      plugin = new TogglePointInjection({
        pointCuts: testCases.map(({ moduleName, ...rest }) => rest) // eslint-disable-line no-unused-vars
      });
      built = await build(
        {
          ...fileSystem,
          "/src/index.js": `export { default } from "${modulesFolder}${moduleName}";`,
          [`${togglePointModule1}.js`]:
            "export default (joinPointModule, featuresMap) => ({ joinPointModule, featuresMap })",
          [`${modulesFolder}${variantsFolder}/${testFeature}/${testVariant}/${moduleName}`]: `export default "${variantModuleOutput}";`,
          [`${modulesFolder}${moduleName}`]: `export default "${baseModuleOutput}";`
        },
        (config) => {
          config.plugins.push(plugin);
        }
      );
    });

    it("should warn that the latter join point was not applied", () => {
      expect(getLogOfType("warn")).toEqual(
        `Join point "${modulesFolder}${moduleName}" is already assigned to point cut "${testCases[0].name}". Skipping assignment to "${testCases[1].name}".`
      );
    });
  });
});
