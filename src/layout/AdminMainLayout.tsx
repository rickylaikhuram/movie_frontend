// layout/AdminMainLayout.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/layout/AdminSidebar";
import { useState } from "react";

const AdminMainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab name from URL (e.g., /products -> 'products')
  const path = location.pathname.split("/")[1] || "dashboard";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={path}
        onTabChange={onTabChange}
      />

      {/* Main Content Area - Add margin-left on desktop to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminMainLayout;
