const getPackages = require("./get_packages");

const changeLogLocation = "docs/CHANGELOG.md";

const errorIfNoChangelog = ({
  fileMatches,
  expectedChangeLogLocation,
  locationDescription
}) => {
  const { edited } = danger.git.fileMatch(...fileMatches);
  if (edited && !danger.git.fileMatch(expectedChangeLogLocation).edited) {
    fail(`Please add a changelog entry for changes to ${locationDescription}`);
  }
};

schedule(async (resolve) => {
  const packages = await getPackages();
  const togglePackages = packages.filter(({ location }) => !location.includes("peripheral"));
  const packageLocations = togglePackages.map(({ location }) => location);
  errorIfNoChangelog({
    fileMatches: ["**/*", `!{${packageLocations.join(",")}}/**/*` , "!package-lock.json"],
    expectedChangeLogLocation: changeLogLocation,
    locationDescription: "the repo root"
  });
  for (const { location, name } of togglePackages) {
    errorIfNoChangelog({
      fileMatches: [`${location}/**/*`],
      expectedChangeLogLocation: `${location}/${changeLogLocation}`,
      locationDescription: `package "${name}"`
    });
  }

  resolve();
});
