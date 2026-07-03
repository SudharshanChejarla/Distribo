
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // Desktop collapse state
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="h-screen bg-slate-100 overflow-hidden">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;