import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import Offline from "./pages/Offline.jsx";

const online = (
  <>
    <App />
    <Toaster closeButton richColors position="bottom-right" visibleToasts={3} />
  </>
);

const offline = <Offline />;

const root = createRoot(document.getElementById("root"));

root.render(online);

// Online
window.addEventListener("online", () => {
  root.render(online);
});

// Offline
window.addEventListener("offline", () => {
  root.render(offline);
});
