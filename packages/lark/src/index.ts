export { Command } from './Command'
export { Config } from './config'

import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { Config } from './config'

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
)

// Load the configuration
Config.load()
