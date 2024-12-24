const pluginsHookFactory = (plugins) => {
  const usePlugins = plugins.reduceRight(
    (out, { onCodeSelected }) =>
      (...args) => {
        onCodeSelected(...args);
        out?.(...args);
      },
    null
  );
  return usePlugins;
};

export default pluginsHookFactory;
