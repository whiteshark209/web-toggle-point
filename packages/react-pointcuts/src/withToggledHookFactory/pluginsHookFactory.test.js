import pluginsHookFactory from "./pluginsHookFactory";

describe("pluginsHookFactory", () => {
  let pluginsHook;
  const plugins = [
    { onCodeSelected: jest.fn() },
    { onCodeSelected: jest.fn() },
    { onCodeSelected: jest.fn() }
  ];

  beforeEach(() => {
    pluginsHook = pluginsHookFactory(plugins);
  });

  it("should return a function", () => {
    expect(pluginsHook).toEqual(expect.any(Function));
  });

  describe("when the plugins hook is called", () => {
    const args = [Symbol("test-arg1"), Symbol("test-arg2")];

    beforeEach(() => {
      pluginsHook(...args);
    });

    it("should call each plugin's 'onCodeSelected' method, in the given order, with the arguments supplied to the returned hook", () => {
      let lastPlugin;
      plugins.forEach((plugin) => {
        expect(plugin.onCodeSelected).toHaveBeenCalledWith(...args);
        if (lastPlugin) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(plugin.onCodeSelected).toHaveBeenCalledAfter(
            lastPlugin.onCodeSelected
          );
        }
        lastPlugin = plugin;
      });
    });
  });
});
