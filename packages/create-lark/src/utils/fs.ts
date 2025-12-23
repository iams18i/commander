import fs from 'fs-extra'
import path from 'path'
import { logger } from './logger.js'

/**
 * Check if directory exists and is not empty
 */
export async function isDirectoryNotEmpty(dir: string): Promise<boolean> {
  try {
    const exists = await fs.pathExists(dir)
    if (!exists) return false
    
    const files = await fs.readdir(dir)
    return files.length > 0
  } catch {
    return false
  }
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDir(dir: string): Promise<void> {
  await fs.ensureDir(dir)
}

/**
 * Copy file or directory
 */
export async function copy(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest)
}

/**
 * Read file as string
 */
export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8')
}

/**
 * Write file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return await fs.pathExists(filePath)
}

/**
 * Get all files recursively in a directory
 */
export async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  
  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }
  
  await walk(dir)
  return files
}

/**
 * Remove file extension
 */
export function removeExtension(filePath: string): string {
  const ext = path.extname(filePath)
  return filePath.slice(0, -ext.length)
}

