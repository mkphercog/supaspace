import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PhotoProvider } from "react-photo-view";

import App from "./App";
import { ONE_MIN_IN_MS } from "./constants";

import "react-photo-view/dist/react-photo-view.css";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: ONE_MIN_IN_MS * 3,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PhotoProvider>
        <App />
      </PhotoProvider>
    </QueryClientProvider>
  </StrictMode>
);

document.getElementById("boot-loader")?.remove();
