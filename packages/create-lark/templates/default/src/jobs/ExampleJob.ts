import { Job } from '@s18i/quirk'

class ExampleJob extends Job {
  async handle(): Promise<boolean> {
    // Implement your job handling logic here
    return true
  }
}

Job.register(ExampleJob)

export { ExampleJob }

