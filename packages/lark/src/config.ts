import { resolve } from 'path'
import consola from 'consola'

export class Config {
  private static instance: Config

  static data: {
    [name: string]: any
  } = {}

  static commands: {
    [name: string]: any
  } = {}

  static jobs: {
    [name: string]: any
  } = {}

  static queues: string[] = []

  static readonly CONFIG_FILE = 'lark.config.js'

  static readonly CONFIG_CONTENT = `export default {
  commands: './commands',
  jobs: './jobs',
}
`

  private constructor() {}

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }

  static load() {
    const configPath = resolve(process.cwd(), Config.CONFIG_FILE)
    try {
      const configModule = require(configPath)
      Config.data = configModule.default || configModule
    } catch (error) {
      consola.warn({
        message: `Configuration file not found. You can run init command to create ${Config.CONFIG_FILE}.`,
        badge: true,
      })

      Config.data = {
        commands: './commands',
        jobs: './jobs',
      }
    }
  }
}
