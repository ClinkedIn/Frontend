// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Create a test server instance using MSW
export const server = setupServer(...handlers);

// Start the mock server before tests run
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset request handlers after each test to avoid test interference
afterEach(() => server.resetHandlers());

// Close the server once tests are complete
afterAll(() => server.close());
