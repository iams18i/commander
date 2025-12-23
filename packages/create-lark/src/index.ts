import { cli } from './cli.js'

cli(process.argv.slice(2)).catch((error) => {
  console.error(error)
  process.exit(1)
})

