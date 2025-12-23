export default {
  commands: './src/commands',
  jobs: {
    queues: ['default'],
    dir: './src/jobs',
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

