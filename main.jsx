import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import MatchProvider from "./context/MatchContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
  <AuthProvider>
  <MatchProvider>
      <App />
    </MatchProvider> {/* or your Router */}
  </AuthProvider>
</ThemeProvider>
    
  </React.StrictMode>
);