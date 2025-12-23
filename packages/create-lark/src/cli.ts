import minimist from 'minimist'
import { logger } from './utils/logger.js'
import { runPrompts, getTemplateVariables } from './prompts.js'
import { scaffoldProject } from './scaffold.js'
import { initGit } from './utils/git.js'
import { printNextSteps } from './utils/logger.js'
import type { Options, ParsedArgs, Template } from './types.js'

const VERSION = '1.0.4'

/**
 * Parse CLI arguments
 */
export function parseArgs(args: string[]): ParsedArgs {
  const parsed = minimist(args, {
    boolean: ['git', 'install', 'yes', 'dry-run', 'verbose', 'help', 'version'],
    string: ['template'],
    alias: {
      t: 'template',
      y: 'yes',
      h: 'help',
      v: 'version',
    },
  })

  return {
    projectName: parsed._[0],
    template: parsed.template as Template | undefined,
    git: parsed.git,
    install: parsed.install,
    yes: parsed.yes,
    dryRun: parsed['dry-run'],
    verbose: parsed.verbose,
    help: parsed.help,
    version: parsed.version,
  }
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
${logger.bold('create-lark')} - Scaffold a new Lark project

Usage:
  npm create @s18i/lark [project-name] [options]

Options:
  --template, -t    Template to use: default, api, library
  --git             Initialize git repository (default: true)
  --install         Run package manager install after scaffolding
  --yes, -y         Skip prompts, use defaults
  --dry-run         Preview without creating files
  --verbose         Show detailed output
  --help, -h        Show this help message
  --version, -v     Show version

Examples:
  npm create @s18i/lark
  npm create @s18i/lark my-project
  npm create @s18i/lark my-project --template api
  npm create @s18i/lark my-project --template default --git --install
`)
}

/**
 * Show version
 */
function showVersion(): void {
  console.log(VERSION)
}

/**
 * Install dependencies
 */
async function installDependencies(
  targetDir: string,
  packageManager: string,
): Promise<void> {
  try {
    const { execSync } = await import('child_process')
    logger.step(`Installing dependencies with ${packageManager}...`)
    
    // Use appropriate install command for each package manager
    let installCommand: string
    if (packageManager === 'yarn') {
      installCommand = 'yarn'
    } else {
      installCommand = `${packageManager} install`
    }
    
    execSync(installCommand, {
      cwd: targetDir,
      stdio: 'inherit',
    })
    logger.success('Dependencies installed')
  } catch (error) {
    logger.warn('Failed to install dependencies')
    if (error instanceof Error) {
      logger.dim(error.message)
    }
  }
}

/**
 * Main CLI function
 */
export async function cli(args: string[]): Promise<void> {
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log()
    logger.warn('Cancelled by user')
    process.exit(130)
  })

  const parsed = parseArgs(args)

  // Handle help and version
  if (parsed.help) {
    showHelp()
    return
  }

  if (parsed.version) {
    showVersion()
    return
  }

  // Validate template if provided
  if (parsed.template && parsed.template !== 'default') {
    logger.error(`Invalid template: ${parsed.template}`)
    logger.info('Available templates: default')
    process.exit(1)
  }

  // Validate project name if provided
  if (parsed.projectName) {
    const validate = (await import('validate-npm-package-name')).default
    const validation = validate(parsed.projectName)
    if (!validation.validForNewPackages) {
      const errors = validation.errors || validation.warnings || []
      logger.error(`Invalid project name: ${errors[0] || 'Invalid name'}`)
      process.exit(1)
    }
  }

  logger.bold('🚀 Creating a new Lark project...')
  console.log()

  // Run prompts for missing options
  const partialOptions: Partial<Options> = {
    projectName: parsed.projectName,
    template: parsed.template,
    git: parsed.git ?? true,
    install: parsed.install ?? false,
    yes: parsed.yes ?? false,
    dryRun: parsed.dryRun ?? false,
    verbose: parsed.verbose ?? false,
  }

  const promptResults = await runPrompts(partialOptions)

  // Merge results
  const options: Options = {
    projectName: promptResults.projectName!,
    template: promptResults.template!,
    features: promptResults.features || [],
    packageManager: promptResults.packageManager || 'npm',
    git: promptResults.git ?? true,
    install: promptResults.install ?? false,
    yes: partialOptions.yes ?? false,
    dryRun: partialOptions.dryRun ?? false,
    verbose: partialOptions.verbose ?? false,
  }

  if (options.verbose) {
    logger.dim(`Project name: ${options.projectName}`)
    logger.dim(`Template: ${options.template}`)
    logger.dim(`Features: ${options.features.join(', ') || 'none'}`)
    logger.dim(`Package manager: ${options.packageManager}`)
    logger.dim(`Git: ${options.git}`)
    logger.dim(`Install: ${options.install}`)
    console.log()
  }

  // Get template variables
  const variables = getTemplateVariables(options)

  // Scaffold project
  const targetDir = process.cwd()
  await scaffoldProject(options, variables)

  // Initialize git if requested
  if (options.git && !options.dryRun) {
    const fullTargetDir = `${targetDir}/${options.projectName}`
    await initGit(fullTargetDir)
  }

  // Install dependencies if requested
  if (options.install && !options.dryRun) {
    const fullTargetDir = `${targetDir}/${options.projectName}`
    await installDependencies(fullTargetDir, options.packageManager)
  }

  // Print next steps
  if (!options.dryRun) {
    printNextSteps(options)
  }
}
