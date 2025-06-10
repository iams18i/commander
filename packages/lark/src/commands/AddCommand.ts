import { Command } from '../Command'
import { Config } from '../config'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import prompts from 'prompts'

class AddCommand extends Command {
  readonly key = 'command:add'
  description = 'Add a new command to the project'

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  async handle([commandName]: string[]): Promise<boolean> {
    let commandKey: string

    if (!commandName) {
      const response = await prompts([
        {
          type: 'text',
          name: 'commandName',
          message: 'Enter the name for the new command:',
          validate: (value: string) =>
            value.length > 0 ? true : 'Command name is required',
        },
      ])

      commandName = response.commandName
    }

    if (!commandName) {
      this.error('Command name is required', true)
      return false
    }

    const defaultKey = this.slugify(commandName)

    const keyResponse = await prompts({
      type: 'text',
      name: 'commandKey',
      message: 'Enter the key for the new command (optional):',
      initial: defaultKey,
    })

    commandKey = keyResponse.commandKey || defaultKey

    const commandsPath = resolve(process.cwd(), Config.data.commands)
    const fileName = `${commandName.charAt(0).toUpperCase() + commandName.slice(1)}Command.ts`
    const filePath = resolve(commandsPath, fileName)

    if (existsSync(filePath)) {
      this.error(`Command file ${fileName} already exists`, true)
      return false
    }

    const commandContent = `import { Command } from '@s18i/lark'

class ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}Command extends Command {
  readonly key = '${commandKey}'

  async handle() {
    // Command logic here

    return true
  }
}

Command.register(${commandName.charAt(0).toUpperCase() + commandName.slice(1)}Command)

export { ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}Command }
`

    try {
      writeFileSync(filePath, commandContent, 'utf8')
      this.success(`Command ${fileName} created successfully`, true)
      return true
    } catch (error) {
      this.error(
        `Failed to create command ${fileName}: ${(error as Error).message}`,
        true,
      )
      return false
    }
  }
}

Command.register(AddCommand)

export { AddCommand }
