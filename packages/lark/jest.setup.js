// Mock consola
jest.mock('consola', () => ({
  info: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
}))

// Export mock for use in tests
global.mockConsola = {
  info: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
}
