import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";

export default function AdminLayout() {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden relative">
      <Header />
      <main className="h-full w-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
