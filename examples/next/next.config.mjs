import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "md", "mdx", "ts", "tsx"]
};

import { TogglePointInjection } from "@asos/web-toggle-point-webpack/plugins";
const togglePointInjection = new TogglePointInjection({
  pointCuts: [
    {
      name: "experiments",
      togglePointModule: "/src/app/fixtures/experiments/withTogglePoint",
      variantGlob:
        "./src/app/fixtures/experiments/**/__variants__/*/*/!(*.spec).tsx"
    }
  ],
  webpackNormalModule: async () =>
    (await import("next/dist/compiled/webpack/NormalModule.js")).default
});

nextConfig.webpack = (config) => {
  return {
    ...config,
    plugins: [...config.plugins, togglePointInjection]
  };
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm]
  }
});

export default withMDX(nextConfig);
