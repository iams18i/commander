# @s18i/create-lark

Scaffold a new Lark project with predefined templates.

## Installation

```bash
npm create @s18i/lark
```

## Usage

### Interactive Mode

```bash
npm create @s18i/lark
```

### With Project Name

```bash
npm create @s18i/lark my-project
```

### With Template

```bash
npm create @s18i/lark my-project --template api
```

### Full Options

```bash
npm create @s18i/lark my-project --template default --git --install
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `[project-name]` | Name of the project directory | (prompted) |
| `--template, -t` | Template: `default`, `api`, `library` | (prompted) |
| `--git` | Initialize git repository | `true` |
| `--install` | Run package manager install | `false` |
| `--yes, -y` | Skip prompts, use defaults | `false` |
| `--dry-run` | Preview without creating files | `false` |
| `--verbose` | Show detailed output | `false` |
| `--help, -h` | Show help message | - |
| `--version, -v` | Show version | - |

## Templates

### Default

Basic TypeScript starter with:
- TypeScript configuration
- tsup for building
- tsx for development

### API

REST API template with:
- Fastify framework
- TypeScript setup
- Routes and middleware structure

### Library

Publishable npm package template with:
- TypeScript with declarations
- tsup configuration
- Proper package.json exports

## Template Variables

Templates support variable replacement using `{{variable}}` syntax:

- `{{projectName}}` - Project name (kebab-case)
- `{{projectDescription}}` - Project description
- `{{authorName}}` - Git user name
- `{{authorEmail}}` - Git user email
- `{{year}}` - Current year
- `{{nodeVersion}}` - Node.js major version
- `{{packageManager}}` - Selected package manager

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Development mode
npm run dev
```

## Testing Locally

```bash
# Build the package
npm run build

# Test locally
node dist/index.js test-project

# Or link globally
npm link
create-lark test-project
```

## License

MIT

