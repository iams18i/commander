# Quirk

Quirk is a robust job processing system built on top of Bull, providing a simple and powerful way to handle background tasks in your applications.

## Features

- Queue-based job processing
- Automatic retry mechanism
- Job prioritization
- Delayed job execution
- Real-time job status monitoring
- Redis-backed persistence
- Multiple queue support

## Usage

### Basic Job Definition

```typescript
import { Job } from '@s18i/quirk'

class MyJob extends Job {
  // Optional: Override default queue name
  queueName = 'custom-queue'

  // Optional: Override default retry attempts
  attempts = 3

  async handle(): Promise<boolean> {
    // Your job logic here
    return true
  }
}

Job.register(MyJob)
```

### Dispatching Jobs

```typescript
// Dispatch to queue
await new MyJob().dispatch()

// Execute immediately
await new MyJob().dispatchNow()

// Dispatch with delay (in milliseconds)
const job = new MyJob()
job.delay = 5000 // 5 seconds
await job.dispatch()
```

### Queue Configuration

Configure queues in your `lark.config.js`:

```javascript
export default {
  jobs: {
    queues: ['default', 'high-priority', 'low-priority'],
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

## API Reference

### Job Class

```typescript
abstract class Job {
  queueName: string = 'default'
  queue?: Queue
  delay: number = 0
  attempts: number = 5

  abstract handle(): Promise<boolean> | boolean

  dispatch(...args: any[]): Promise<boolean>
  dispatchNow(...args: any[]): Promise<boolean>

  info(message: string, badge?: boolean, args?: any[]): void
  success(message: string, badge?: boolean): void

  static register(job: any): void
}
```

### Queue Configuration

```typescript
interface QueueOptions {
  redis: {
    port: number
    host: string
    password?: string
  }
  defaultJobOptions: {
    removeOnComplete: boolean
    attempts: number
  }
}
```

## Job Processing

### Queue Worker

The queue worker processes jobs in the background:

```typescript
import { initQueues } from '@s18i/quirk'

// Initialize queues and start processing
initQueues()
```

### Job Lifecycle

1. Job is created and registered
2. Job is dispatched to a queue
3. Worker picks up the job
4. Job is processed (handle method is called)
5. On success: Job is marked as complete
6. On failure: Job is retried based on attempts configuration

## Error Handling

Jobs should handle their own errors appropriately:

```typescript
class MyJob extends Job {
  async handle(): Promise<boolean> {
    try {
      // Job logic
      return true
    } catch (error) {
      this.error(`Job failed: ${error.message}`)
      throw error // This will trigger retry mechanism
    }
  }
}
```

## Development

### Installation

```bash
bun add @s18i/quirk
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

## Dependencies

- Bull: For queue management
- Redis: For job persistence
- Consola: For logging
