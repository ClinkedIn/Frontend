import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from "./App.tsx";
import { worker } from "./mocks/browser";
// import { CookiesProvider } from "react-cookie";
async function enableMocking() {
  // Always enable in development, regardless of VITE_NODE_ENV
  if (process.env.NODE_ENV === "development") {
    return worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  const queryClient = new QueryClient();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {/* <CookiesProvider> */}
          <App />
          {/* </CookiesProvider> */}
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
});
