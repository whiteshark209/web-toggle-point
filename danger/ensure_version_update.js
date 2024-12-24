const getPackages = require("./get_packages.js");

const hasPackageVersionChanged = async ({ packageJson }) =>
  !!(await danger.git.JSONDiffForFile(packageJson)).version;

const checkForUpdates = async ({
  dependentPackageJson,
  packageJson,
  dependent,
  name
}) => {
  const { edited } = danger.git.fileMatch(dependentPackageJson);
  if (edited) {
    if (
      !(
        danger.git.created_files.includes(packageJson) ||
        (await hasPackageVersionChanged({ packageJson }))
      )
    ) {
      fail(
        `${dependent.name} has been added/updated, and is a dependent of ${name}, which has not had its version number updated`
      );
    }
  }
};

schedule(async (resolve) => {
  const packages = await getPackages();
  const publishedPackages = packages.filter(
    ({ private: isPrivate }) => !isPrivate
  );
  const withWorkspaceDependencies = publishedPackages.filter(
    ({ workspaceDependencies = [] }) =>
      Object.values(workspaceDependencies).some((value) =>
        value.startsWith("file:")
      )
  );
  for (const {
    location,
    name,
    workspaceDependencies
  } of withWorkspaceDependencies) {
    for (const dependentName of Object.keys(workspaceDependencies)) {
      const dependent = publishedPackages.find(
        ({ name }) => name === dependentName
      );
      const dependentPackageJson = `${dependent.location}/package.json`;
      const packageJson = `${location}/package.json`;
      await checkForUpdates({
        dependentPackageJson,
        packageJson,
        dependent,
        name
      });
    }
  }
  resolve();
});
