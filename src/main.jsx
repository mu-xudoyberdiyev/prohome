import { createRoot } from "react-dom/client";
import "./index.css";
import "react-photo-view/dist/react-photo-view.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import Offline from "./pages/Offline.jsx";
import { LoadingBarContainer } from "react-top-loading-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const online = (
  <QueryClientProvider client={queryClient}>
    <LoadingBarContainer>
      <App />
      <Toaster
        closeButton
        richColors
        position="bottom-right"
        visibleToasts={3}
      />
    </LoadingBarContainer>
  </QueryClientProvider>
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
