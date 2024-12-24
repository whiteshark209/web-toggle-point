import pkg from "./package.json" with { type: "json" };
const projects = pkg.workspaces
  .filter((workspace) => workspace.startsWith("packages/"))
  .map((workspace) => `<rootDir>/${workspace}`);

export default {
  projects
};
