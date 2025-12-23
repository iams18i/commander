#!/usr/bin/env node
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('📦 Installing dependencies...')
execSync('bun install', {
  cwd: rootDir,
  stdio: 'inherit',
})

console.log('\n🔨 Building create-lark...')
execSync('npm run build', {
  cwd: join(rootDir, 'packages/create-lark'),
  stdio: 'inherit',
})

console.log('\n📤 Publishing @s18i/lark...')
execSync('npm publish', {
  cwd: join(rootDir, 'packages/lark'),
  stdio: 'inherit',
})

console.log('\n📤 Publishing @s18i/quirk...')
execSync('npm publish', {
  cwd: join(rootDir, 'packages/quirk'),
  stdio: 'inherit',
})

console.log('\n📤 Publishing @s18i/create-lark...')
execSync('npm publish', {
  cwd: join(rootDir, 'packages/create-lark'),
  stdio: 'inherit',
})

console.log('\n✅ All packages published successfully!')
