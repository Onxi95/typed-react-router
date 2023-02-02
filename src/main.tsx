import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouterProvider } from "./providers/AppRouterProvider";
import { AuthProvider } from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouterProvider />
    </AuthProvider>
  </React.StrictMode>,
);
