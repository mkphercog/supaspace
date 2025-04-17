import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.provider";
import { PhotoProvider } from "react-photo-view";
import App from "./App";

import "react-photo-view/dist/react-photo-view.css";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <PhotoProvider>
            <App />
          </PhotoProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>
);
