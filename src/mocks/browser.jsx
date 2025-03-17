
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the MSW worker
export const worker = setupWorker(...handlers);
