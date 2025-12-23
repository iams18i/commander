import { execSync } from 'child_process'
import { logger } from './logger.js'

/**
 * Get git user name from config
 */
export function getGitUserName(): string {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim()
  } catch {
    return 'Anonymous'
  }
}

/**
 * Get git user email from config
 */
export function getGitUserEmail(): string {
  try {
    return execSync('git config user.email', { encoding: 'utf-8' }).trim()
  } catch {
    return 'anonymous@example.com'
  }
}

/**
 * Initialize git repository in directory
 */
export async function initGit(targetDir: string): Promise<void> {
  try {
    const { execSync } = await import('child_process')
    execSync('git init', { cwd: targetDir, stdio: 'ignore' })
    logger.step('Initialized git repository')
  } catch (error) {
    logger.warn('Failed to initialize git repository')
  }
}

