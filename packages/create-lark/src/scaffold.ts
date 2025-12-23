import path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './utils/logger.js'
import * as fs from './utils/fs.js'
import { processTemplate, isTemplateFile, getTargetFilePath } from './utils/template.js'
import type { Options, TemplateVariables } from './types.js'

// Get templates directory relative to package root
// In development: src/../templates
// In dist: dist/../templates
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates')

/**
 * Copy and process template files
 */
export async function scaffoldProject(options: Options, variables: TemplateVariables): Promise<void> {
  const { projectName, template, dryRun } = options
  const targetDir = path.resolve(process.cwd(), projectName)
  
  if (dryRun) {
    logger.info(`[DRY RUN] Would create project in: ${targetDir}`)
    logger.info(`[DRY RUN] Template: ${template}`)
    return
  }
  
  // Check if directory exists and is not empty
  if (await fs.isDirectoryNotEmpty(targetDir)) {
    logger.error(`Directory ${projectName} already exists and is not empty`)
    process.exit(1)
  }
  
  logger.info(`Scaffolding project in ${targetDir}...`)
  
  // Ensure target directory exists
  await fs.ensureDir(targetDir)
  
  // Copy base template files first
  const baseTemplateDir = path.join(TEMPLATES_DIR, 'base')
  if (await fs.fileExists(baseTemplateDir)) {
    logger.step('Copying base template files')
    await copyTemplateFiles(baseTemplateDir, targetDir, variables)
  }
  
  // Copy selected template files (overrides base)
  const templateDir = path.join(TEMPLATES_DIR, template)
  if (!(await fs.fileExists(templateDir))) {
    logger.error(`Template "${template}" not found`)
    process.exit(1)
  }
  
  logger.step(`Copying ${template} template files`)
  await copyTemplateFiles(templateDir, targetDir, variables)
  
  logger.success('Template files copied')
}

/**
 * Copy template files and process variables
 */
async function copyTemplateFiles(
  sourceDir: string,
  targetDir: string,
  variables: TemplateVariables
): Promise<void> {
  const allFiles = await fs.getAllFiles(sourceDir)
  
  for (const sourceFile of allFiles) {
    const relativePath = path.relative(sourceDir, sourceFile)
    const targetFile = path.join(targetDir, relativePath)
    
    // Get target path (remove .hbs if present)
    const finalTargetFile = getTargetFilePath(targetFile)
    
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(finalTargetFile))
    
    // Read source file
    const content = await fs.readFile(sourceFile)
    
    // Process template if it's a .hbs file
    const processedContent = isTemplateFile(sourceFile)
      ? processTemplate(content, variables)
      : content
    
    // Write to target
    await fs.writeFile(finalTargetFile, processedContent)
  }
}

