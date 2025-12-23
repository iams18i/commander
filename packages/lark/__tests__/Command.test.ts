import { Command } from '../src/Command'
import { Config } from '../src/config'
import consola from 'consola'
import { describe, expect, it, mock, beforeEach } from 'bun:test'

// Mock consola methods
const mockConsola = {
  info: mock(() => {}),
  error: mock(() => {}),
  success: mock(() => {}),
}

// Replace the real implementations with mocks
Object.assign(consola, mockConsola)

declare global {
  var mockConsola: typeof consola
}

describe('Command', () => {
  // Create a test command class
  class TestCommand extends Command {
    readonly key = 'test'
    description = 'Test command'

    async handle(): Promise<boolean> {
      return true
    }
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Reset Config.commands
    Config.commands = {}
  })

  describe('Command Registration', () => {
    it('should register a command with Config', () => {
      Command.register(TestCommand)
      expect(Config.commands['test']).toBe(TestCommand)
    })
  })

  describe('Logging Methods', () => {
    let command: TestCommand

    beforeEach(() => {
      command = new TestCommand()
    })

    it('should log info messages', () => {
      command.info('Test info message')
      expect(consola.info).toHaveBeenCalledWith('Test info message')
    })

    it('should log info messages with badge', () => {
      command.info('Test info message', true)
      expect(consola.info).toHaveBeenCalledWith({
        message: 'Test info message',
        badge: true,
      })
    })

    it('should log error messages', () => {
      command.error('Test error message')
      expect(consola.error).toHaveBeenCalledWith({
        message: 'Test error message',
        badge: true,
      })
    })

    it('should log success messages', () => {
      command.success('Test success message')
      expect(consola.success).toHaveBeenCalledWith('Test success message')
    })

    it('should log success messages with badge', () => {
      command.success('Test success message', true)
      expect(consola.success).toHaveBeenCalledWith({
        message: 'Test success message',
        badge: true,
      })
    })
  })

  describe('Command Execution', () => {
    it('should execute handle method', async () => {
      const command = new TestCommand()
      const result = await command.handle()
      expect(result).toBe(true)
    })
  })
})
