import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PhotoProvider } from "react-photo-view";

import App from "./App";

import "react-photo-view/dist/react-photo-view.css";
import "./index.css";

const queryClient = new QueryClient();

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
