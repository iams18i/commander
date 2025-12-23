import type { TemplateVariables } from '../types.js'

/**
 * Simple template variable replacement using regex
 * Supports {{variable}} syntax
 */
export function processTemplate(content: string, variables: TemplateVariables): string {
  const vars: Record<string, string | number> = {
    projectName: variables.projectName,
    projectDescription: variables.projectDescription,
    authorName: variables.authorName,
    authorEmail: variables.authorEmail,
    year: variables.year,
    nodeVersion: variables.nodeVersion,
    packageManager: variables.packageManager,
  }
  
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = vars[key]
    return value !== undefined ? String(value) : match
  })
}

/**
 * Check if file should be processed as template (ends with .hbs)
 */
export function isTemplateFile(filePath: string): boolean {
  return filePath.endsWith('.hbs')
}

/**
 * Get target file path (remove .hbs extension if present)
 */
export function getTargetFilePath(filePath: string): string {
  if (isTemplateFile(filePath)) {
    return filePath.slice(0, -4) // Remove .hbs
  }
  return filePath
}

