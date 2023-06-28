import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PresetGeneratorSchema } from './schema';

export default async function (tree: Tree, options: PresetGeneratorSchema) {
  const projectRoot = `.`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      serve: {
        executor: 'my-own-react:serve',
      },
    },
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    template: '',
  });
  await formatFiles(tree);

  return addDependenciesToPackageJson(
    tree,
    {
      react: 'latest',
      'react-dom': 'latest',
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      'react-scripts': 'latest',
    },
    {}
  );
}
