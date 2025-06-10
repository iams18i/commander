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
    // password: 'password',
  },
}
