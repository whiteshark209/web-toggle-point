import { forwardRef } from "react";

const wrap = ({ Component, useHook, name }, rest) => {
  const WithTogglePointPlugin = forwardRef((props, ref) => {
    useHook(rest);

    return <Component {...props} ref={ref} />;
  });

  WithTogglePointPlugin.displayName = `With${name}(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithTogglePointPlugin;
};

const withPlugins = ({ Component, plugins, ...rest }) => {
  for (const { onCodeSelected: useHook, name } of plugins) {
    Component = wrap(
      {
        Component,
        useHook,
        name
      },
      rest
    );
  }

  return Component;
};

export default withPlugins;
