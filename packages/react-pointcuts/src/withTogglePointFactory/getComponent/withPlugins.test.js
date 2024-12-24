import { render } from "@testing-library/react";
import withPlugins from "./withPlugins";
import { forwardRef } from "react";

describe("withPlugins", () => {
  const plugins = [
    { name: "Plugin1", onCodeSelected: jest.fn() },
    { name: "Plugin2", onCodeSelected: jest.fn(), onSomeOtherThing: () => {} }
  ];
  const rest = {
    testProp: Symbol("test-value"),
    anotherTestProp: Symbol("test-another-value")
  };
  const mockComponent = "test-component";
  const TestComponent = forwardRef(() => (
    <div data-testid={mockComponent}></div>
  ));

  const makeCommonAssertions = () => {
    it("should execute the 'onCodeSelected' hooks of all plugins, in reverse order (since first plugin applies closest to the wrapped component), passing the props passed to withPlugins", () => {
      let lastPlugin;
      plugins.forEach((plugin) => {
        expect(plugin.onCodeSelected).toHaveBeenCalledTimes(1);
        expect(plugin.onCodeSelected).toHaveBeenCalledWith(rest);
        if (lastPlugin) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(plugin.onCodeSelected).toHaveBeenCalledBefore(
            lastPlugin.onCodeSelected
          );
        }
        lastPlugin = plugin;
      });
    });
  };

  describe.each`
    displayName                   | name                   | expectedDisplayName
    ${"TestComponentDisplayName"} | ${"TestComponentName"} | ${"TestComponentDisplayName"}
    ${null}                       | ${"TestComponentName"} | ${"TestComponentName"}
    ${null}                       | ${null}                | ${"Component"}
  `(
    "when the component has a name of $name and a display name of $displayName",
    ({ displayName, name, expectedDisplayName }) => {
      let Wrapped;

      beforeEach(() => {
        jest.clearAllMocks();
        TestComponent.displayName = displayName;
        TestComponent.name = name;

        Wrapped = withPlugins({ Component: TestComponent, plugins, ...rest });
        render(<Wrapped />);
      });

      it("should have a display name that wraps the component in the plugins, in order", () => {
        expect(Wrapped.displayName).toBe(
          `With${plugins[1].name}(With${plugins[0].name}(${expectedDisplayName}))`
        );
      });

      makeCommonAssertions();
    }
  );
});
