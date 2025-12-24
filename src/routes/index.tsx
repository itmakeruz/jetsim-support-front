import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "@/components/loader/Loader";
import AdminLayout from "@/layouts/AdminLayouts";

// Lazy load login and error pages
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
// const Error404 = lazy(() => import("@/pages/404/Error404"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader isFullScreen />}>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {adminRoutes.map(({ path, element, children }) => (
              <Route key={path} path={path} element={element}>
                {children &&
                  children.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
              </Route>
            ))}
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />

        {/* <Route path="*" element={<Error404 />} /> */}
      </Routes>
    </Suspense>
  );
}
