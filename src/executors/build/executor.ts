import { execSync } from 'child_process';
import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName].root;
  execSync('npx react-scripts build', { stdio: 'inherit', cwd: projectRoot });
  return {
    success: true,
  };
}
