import { Command } from '../Command'
import { Config } from '../config'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

class InitCommand extends Command {
  readonly key = 'init'
  description = 'Initialize a new Lark configuration file'

  async handle(): Promise<boolean> {
    const configPath = resolve(process.cwd(), Config.CONFIG_FILE)

    if (existsSync(configPath)) {
      this.error(`${Config.CONFIG_FILE} already exists`, true)
      return false
    }

    const configContent = `export default ${JSON.stringify(Config.DEFAULT_CONFIG, null, 2)}`

    try {
      writeFileSync(configPath, configContent, 'utf8')
      this.success(`${Config.CONFIG_FILE} created successfully`, true)
      return true
    } catch (error) {
      this.error(
        `Failed to create ${Config.CONFIG_FILE}: ${(error as Error).message}`,
        true,
      )
      return false
    }
  }
}

Command.register(InitCommand)

export { InitCommand }
