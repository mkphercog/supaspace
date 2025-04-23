import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext/AuthContext.provider";
import { SidebarProvider } from "./context/SidebarContext/SidebarContext.provider";
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
          <SidebarProvider>
            <PhotoProvider>
              <App />
            </PhotoProvider>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>
);

document.getElementById("boot-loader")?.remove();
