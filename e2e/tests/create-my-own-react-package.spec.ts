import {
  ensureNxProject,
  uniq,
  runCreatePackageCli,
  runNxCommandAsync,
} from "@nrwl/nx-plugin/testing";

describe("create-my-own-react-package e2e", () => {
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

  it("should run create-my-own-react-package", () => {
    const project = uniq("create-my-own-react-package");
    const result = runCreatePackageCli(
      "my-own-react",
      "dist/./.",
      "create-my-own-react-package",
      "dist/./create-my-own-react-package",
      project
    );
    expect(result).toContain("Successfully created");
  }, 120000);
});
