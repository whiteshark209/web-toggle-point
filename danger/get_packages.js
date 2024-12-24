const { spawn } = require("child_process");

const getPackages = () =>
  new Promise((resolve) => {
    const query = spawn("npm", ["query", ".workspace"]);
    const transform = spawn("jq", [
      "map({ name, location, dependencies, private })"
    ]);
    query.stdout.pipe(transform.stdin);
    let output = new Uint8Array(0);
    transform.stdout.on("data", (data) => {
      const new_output = new Uint8Array(output.length + data.length);
      new_output.set(output);
      new_output.set(data, output.length);
      output = new_output;
    });
    transform.on("close", async () => {
      const workspaces = JSON.parse(new TextDecoder().decode(output));
      resolve(workspaces);
    });
  });

module.exports = getPackages;
