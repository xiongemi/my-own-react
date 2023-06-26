import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from "@nx/nx-plugin/testing";

describe("my-own-react e2e", () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject("my-own-react", "dist/./.");
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync("reset");
  });

  xit("should create my-own-react", async () => {
    const project = uniq("my-own-react");
    await runNxCommandAsync(`generate my-own-react:my-own-react ${project}`);
    const result = await runNxCommandAsync(`build ${project}`);
    expect(result.stdout).toContain("Executor ran");
  }, 120000);
});
