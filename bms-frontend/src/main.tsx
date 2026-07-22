import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LocationProvider } from "./context/LocationContext";
import { AuthProvider } from "./context/AuthContext";

import App from "./App.jsx";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10000 },
  },
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <Router>
      <LocationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LocationProvider>
    </Router>
  </QueryClientProvider>,
  // </StrictMode>,
);
