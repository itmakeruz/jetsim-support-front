import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader/Loader";

// import { isRouteAccessible } from "@/utils/routeFilter";
// import Error404 from "./Error404";

export default function ProtectedRoute() {
  const { token, logout, getProfile, isLoading, setIsLoading, setUser } =
    useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) throw new Error("Token yo'q");
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <Loader isFullScreen />;

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if the current route is accessible for the user's role
  // if (!isRouteAccessible(location.pathname, currentUser)) {
  //   // Return 404 page for blocked routes
  //   return <Error404 />;
  // }
  return <Outlet />;
}
