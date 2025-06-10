# Lark

Lark is the core framework package that provides the foundation for building CLI applications with a robust command system.

## Features

- Command registration and management
- Built-in logging utilities
- Configuration management
- Command-line argument parsing
- Interactive command creation

## Usage

### Command System

Lark provides a base `Command` class that all commands should extend:

```typescript
import { Command } from '@s18i/lark'

class MyCommand extends Command {
  readonly key = 'my-command' // This will be the command name in CLI
  description = 'Description of what my command does'

  async handle() {
    // Your command logic here
    return true
  }
}

Command.register(MyCommand)
```

### Built-in Logging

Commands have access to built-in logging methods:

```typescript
this.info('Information message')
this.error('Error message')
this.success('Success message')
```

### Configuration

Lark uses a `lark.config.js` file for configuration:

```javascript
export default {
  commands: './commands',
  jobs: {
    queues: ['default'],
    dir: './jobs',
    options: {
      removeOnComplete: true,
      attempts: 5,
    },
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
}
```

### Built-in Commands

Lark comes with several built-in commands:

- `command:add` - Create a new command
- `init` - Initialize project configuration

## API Reference

### Command Class

```typescript
abstract class Command {
  abstract readonly key: string
  description: string = ''

  abstract handle(...args: any[]): Promise<boolean> | boolean

  info(message: string, badge?: boolean): void
  error(message: string, badge?: boolean): void
  success(message: string, badge?: boolean): void

  static register(command: any): void
}
```

### Config Class

```typescript
class Config {
  static data: { [name: string]: any }
  static commands: { [name: string]: any }
  static jobs: { [name: string]: any }
  static queues: string[]

  static load(): void
  static getInstance(): Config
}
```

## Development

### Installation

```bash
bun add @s18i/lark
```

### Building

```bash
bun run build
```

### Testing

```bash
bun run test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
