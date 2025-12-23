import pc from 'picocolors'

export const logger = {
  info: (message: string) => console.log(pc.cyan('ℹ'), message),
  success: (message: string) => console.log(pc.green('✔'), message),
  error: (message: string) => console.error(pc.red('✖'), message),
  warn: (message: string) => console.warn(pc.yellow('⚠'), message),
  step: (message: string) => console.log(pc.blue('→'), message),
  dim: (message: string) => console.log(pc.dim(message)),
  bold: (message: string) => console.log(pc.bold(message)),
}

import type { PackageManager } from '../types.js'

export function printNextSteps(options: { projectName: string; packageManager: PackageManager; install?: boolean }) {
  const { projectName, packageManager } = options
  
  console.log()
  logger.success(`Done! Created ${pc.bold(projectName)}`)
  console.log()
  logger.info('Next steps:')
  console.log(pc.dim(`  cd ${projectName}`))
  if (!options.install) {
    console.log(pc.dim(`  ${packageManager} install`))
  }
  console.log(pc.dim(`  ${packageManager} dev`))
  console.log()
  logger.dim('📚 Documentation: https://docs.s18i.io/lark')
}

