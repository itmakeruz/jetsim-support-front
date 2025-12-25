import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes";
import { initializeSocket, disconnectSocket } from "./lib/socket";
import { initializeNotificationSound } from "./utils/playNotificationSound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  // Audio'ni birinchi user interaction bilan initialize qilish (global)
  useEffect(() => {
    if (isInitializedRef.current) return;

    const handleUserInteraction = () => {
      if (!isInitializedRef.current) {
        initializeNotificationSound();
        isInitializedRef.current = true;
        // Bir marta initialize qilingandan keyin event listener'larni olib tashlash
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      }
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("keydown", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
}

export default App;
