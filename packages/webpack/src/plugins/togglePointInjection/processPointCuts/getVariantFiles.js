import { posix } from "path";
import fastGlob from "fast-glob";
const { relative, join } = posix;

const getVariantFiles = async ({ variantGlob, appRoot, fileSystem }) => {
  const results = await fastGlob.glob(join(appRoot, variantGlob), {
    objectMode: true,
    fs: fileSystem
  });

  return results.map(({ path, name }) => ({
    path: `/${relative(appRoot, path)}`,
    name
  }));
};

export default getVariantFiles;
