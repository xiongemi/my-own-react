import { execSync } from 'child_process';
import { ServeExecutorSchema } from './schema';
import { ExecutorContext } from '@nx/devkit';

export default async function runExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName].root;
  execSync('npx react-scripts start', { stdio: 'inherit', cwd: projectRoot });
  return {
    success: true,
  };
}
