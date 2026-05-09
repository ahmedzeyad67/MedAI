import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App.jsx";
import { getUserRole } from "./services/auth/getUserRole";

const initialRole = getUserRole();
if (initialRole) {
  document.documentElement.setAttribute("data-theme", initialRole);
} else {
  document.documentElement.removeAttribute("data-theme");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
