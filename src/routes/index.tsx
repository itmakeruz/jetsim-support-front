import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

        {/* Без этого любой несуществующий путь рендерил пустоту:
            маршрут не совпадал, и внутри лэйаута не отрисовывалось ничего */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
