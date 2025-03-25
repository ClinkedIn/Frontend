import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClientProvider,
  QueryClient
} from '@tanstack/react-query'
import App from './App.tsx'
import { worker } from './mocks/browser';

async function enableMocking() {
  if (import.meta.env.VITE_NODE_ENV === 'DEV') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

await enableMocking();
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
  </StrictMode>,
)
