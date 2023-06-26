import { uniq } from '@nx/nx-plugin/testing';
import { tmpFolder } from '@nx/plugin/testing';
import { ChildProcess, execSync, fork } from 'child_process';

describe('create-my-own-react-package e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  let nxLocalRegistryProcess: ChildProcess;
  let port: number;
  beforeAll(async () => {
    nxLocalRegistryProcess = await new Promise<ChildProcess>(
      (resolve, reject) => {
        const childProcess = fork(
          require.resolve('nx'),
          `local-registry my-own-react --location none --storage ${tmpFolder()}/local-registry/storage --clear true`.split(
            ' '
          ),
          { stdio: 'pipe' }
        );

        childProcess?.stdout?.on('data', (data) => {
          console.log(data.toString());
          if (data.toString().includes('http://localhost:')) {
            port = parseInt(
              data.toString().match(/localhost:(?<port>\d+)/)?.groups?.port
            );
            console.log('Local registry started on port ' + port);

            const registry = `http://localhost:${port}`;
            process.env.npm_config_registry = registry;
            process.env.YARN_REGISTRY = registry;
            execSync(
              `npm config set //localhost:${port}/:_authToken "secretVerdaccioToken"`
            );
            console.log('Set npm and yarn config registry to ' + registry);

            resolve(childProcess);
          }
        });
        childProcess?.stderr?.on('data', (data) => {
          process.stderr.write(data);
          reject(data);
        });
        childProcess.on('error', (err) => {
          console.log('local registry error', err);
          reject(err);
        });
        childProcess.on('exit', (code) => {
          console.log('local registry exit', code);
          reject(code);
        });
      }
    );
  });

  afterAll(() => {
    nxLocalRegistryProcess.kill();
    execSync(
      `npm config delete //localhost:${port}/:_authToken`
    );
  });

  it('should run create-my-own-react-package', () => {
    execSync('nx publish my-own-react --ver=1.0.0 --tag=e2e', {
      env: process.env,
    });
    execSync('nx publish create-my-own-react-package --ver=1.0.0 --tag=e2e', {
      env: process.env,
    });
    const project = uniq('create-my-own-react-package');
    const result = execSync(
      `npx create-my-own-react-package@1.0.0 ${project} --pm=npm --verbose`,
      {
        cwd: tmpFolder(),
        env: process.env,
      }
    );
    expect(result.toString()).toContain('Successfully created');
  }, 120000);
});
