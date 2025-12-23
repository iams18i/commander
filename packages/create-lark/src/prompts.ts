import prompts from 'prompts'
import validateNpmPackageName from 'validate-npm-package-name'
import type { Options, Template, PackageManager, Feature } from './types.js'
import { getGitUserName, getGitUserEmail } from './utils/git.js'
import { logger } from './utils/logger.js'

// validate-npm-package-name exports the function directly as default
const validate = validateNpmPackageName

const TEMPLATES: Template[] = ['default']
const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'pnpm', 'yarn']
const FEATURES: Feature[] = [
  'eslint',
  'prettier',
  'vitest',
  'github-actions',
  'docker',
  'husky',
]

const FEATURE_LABELS: Record<Feature, string> = {
  eslint: 'ESLint',
  prettier: 'Prettier',
  vitest: 'Vitest',
  'github-actions': 'GitHub Actions CI',
  docker: 'Docker support',
  husky: 'Husky + lint-staged',
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): boolean | string {
  if (!name) {
    return 'Project name is required'
  }

  const validation = validate(name)
  if (!validation.validForNewPackages) {
    const errors = validation.errors || validation.warnings || []
    return errors[0] || 'Invalid project name'
  }

  return true
}

/**
 * Run interactive prompts for missing options
 */
export async function runPrompts(
  partialOptions: Partial<Options>,
): Promise<Partial<Options>> {
  const isCI = process.env.CI === 'true' || process.env.CI === '1'

  if (isCI || partialOptions.yes) {
    // Use defaults in CI or when --yes is used
    return {
      projectName: partialOptions.projectName || 'lark-project',
      template: partialOptions.template || 'default',
      features: [],
      packageManager: partialOptions.packageManager || 'npm',
      git: partialOptions.git ?? true,
      install: partialOptions.install ?? false,
    }
  }

  const results: Partial<Options> = {}

  // Project name
  if (!partialOptions.projectName) {
    const nameResponse = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'lark-project',
      validate: validateProjectName,
    })

    if (!nameResponse.projectName) {
      process.exit(0)
    }

    results.projectName = nameResponse.projectName
  } else {
    results.projectName = partialOptions.projectName
  }

  // Template selection
  if (!partialOptions.template) {
    const templateResponse = await prompts({
      type: 'select',
      name: 'template',
      message: 'Select a template:',
      choices: [
        { title: 'Commands', value: 'default' },
        { title: 'Commands + Jobs', value: 'default' },
      ],
      initial: 0,
    })

    if (!templateResponse.template) {
      process.exit(0)
    }

    results.template = templateResponse.template
  } else {
    results.template = partialOptions.template
  }

  // Features selection
  // const featuresResponse = await prompts({
  //   type: 'multiselect',
  //   name: 'features',
  //   message: 'Select features:',
  //   choices: FEATURES.map((feature) => ({
  //     title: FEATURE_LABELS[feature],
  //     value: feature,
  //   })),
  //   initial: 0,
  // })

  // results.features = featuresResponse.features || []
  results.features = []

  // Package manager
  if (!partialOptions.packageManager) {
    const pmResponse = await prompts({
      type: 'select',
      name: 'packageManager',
      message: 'Package manager:',
      choices: PACKAGE_MANAGERS.map((pm) => ({
        title: pm,
        value: pm,
      })),
      initial: 1, // Default to pnpm
    })

    if (!pmResponse.packageManager) {
      process.exit(0)
    }

    results.packageManager = pmResponse.packageManager
  } else {
    results.packageManager = partialOptions.packageManager
  }

  // Git initialization
  if (partialOptions.git === undefined) {
    const gitResponse = await prompts({
      type: 'confirm',
      name: 'git',
      message: 'Initialize git repository?',
      initial: true,
    })

    results.git = gitResponse.git
  } else {
    results.git = partialOptions.git
  }

  // Install dependencies
  if (partialOptions.install === undefined) {
    const installResponse = await prompts({
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies?',
      initial: false,
    })

    results.install = installResponse.install
  } else {
    results.install = partialOptions.install
  }

  return results
}

import type { TemplateVariables } from './types.js'

/**
 * Get template variables for replacement
 */
export function getTemplateVariables(options: Options): TemplateVariables {
  const nodeVersion = process.version.slice(1).split('.')[0]

  return {
    projectName: options.projectName,
    projectDescription: `A new Lark ${options.template} project`,
    authorName: getGitUserName(),
    authorEmail: getGitUserEmail(),
    year: new Date().getFullYear(),
    nodeVersion,
    packageManager: options.packageManager,
  }
}
