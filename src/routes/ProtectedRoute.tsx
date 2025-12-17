import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader/Loader";

// import { isRouteAccessible } from "@/utils/routeFilter";
// import Error404 from "./Error404";

export default function ProtectedRoute() {
  const { token, logout, getProfile } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) throw new Error("Token yo'q");
        const res = await getProfile();
        if (res.success) {
          setIsAuthorized(true);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        logout();
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, getProfile, logout]);

  if (isLoading) return <Loader isFullScreen />;

  // if (!isAuthorized) {
  //   return <Navigate to="/login" />;
  // }

  // Check if the current route is accessible for the user's role
  // if (!isRouteAccessible(location.pathname, currentUser)) {
  //   // Return 404 page for blocked routes
  //   return <Error404 />;
  // }

  return <Outlet />;
}
