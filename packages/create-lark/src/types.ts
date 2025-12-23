export type Template = 'default'

export type PackageManager = 'npm' | 'pnpm' | 'yarn'

export type Feature = 'eslint' | 'prettier' | 'vitest' | 'github-actions' | 'docker' | 'husky'

export interface Options {
  projectName: string
  template: Template
  features: Feature[]
  packageManager: PackageManager
  git: boolean
  install: boolean
  yes: boolean
  dryRun: boolean
  verbose: boolean
}

export interface TemplateVariables {
  projectName: string
  projectDescription: string
  authorName: string
  authorEmail: string
  year: number
  nodeVersion: string
  packageManager: PackageManager
}

export interface ParsedArgs {
  projectName?: string
  template?: Template
  git?: boolean
  install?: boolean
  yes?: boolean
  dryRun?: boolean
  verbose?: boolean
  help?: boolean
  version?: boolean
}

