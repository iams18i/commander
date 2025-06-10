import { Config } from './config'
import consola from 'consola'

// Abstract base class for all CLI commands
export abstract class Command {
  // Unique identifier for the command, must be implemented by subclasses
  abstract readonly key: string

  // Optional description of the command
  description: string = ''

  constructor() {
    // Constructor remains empty, allowing subclasses to define their own initialization if needed
  }

  // Main execution method for the command, must be implemented by subclasses
  abstract handle(...args: any[]): Promise<boolean> | boolean

  // Utility method for logging informational messages
  info(message: string, badge = false): void {
    if (badge) {
      consola.info({
        message: `${message}`,
        badge: true,
      })
    } else {
      consola.info(`${message}`)
    }
  }

  // Utility method for logging error messages
  error(message: string, badge = true): void {
    consola.error({
      message: `${message}`,
      badge: badge,
    })
  }

  // Utility method for logging success messages
  success(message: string, badge = false): void {
    if (badge) {
      consola.success({
        message: `${message}`,
        badge: true,
      })
    } else {
      consola.success(`${message}`)
    }
  }

  // Static method to register a command with the Config class
  static register(command: any) {
    // Create an instance of the command
    const instance = new command()

    // Store the command class in the Config.commands object, using the command's key as the identifier
    Config.commands[instance.key] = command
  }
}
