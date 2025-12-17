import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";

export default function AdminLayout() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <>
      <Header setOpenMenu={setOpenMenu} />
      <div className="flex">
        <Sidebar openMenu={openMenu} />
        <main className="h-[calc(100vh-48px)] bg-[#ffffff] w-full overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </>
  );
}
