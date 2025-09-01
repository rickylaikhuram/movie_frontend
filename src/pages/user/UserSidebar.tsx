// components/UserSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  BookMarkedIcon,
  UserRoundPen,
  Shield,
  LogOut,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slice/auth";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const UserSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleLogout = async () => {
    try {
      dispatch(logout());
      // Check if Redux state actually updated
      setTimeout(() => {
        window.location.href = "/signin";
      }, 50);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const sidebarItems: SidebarItem[] = [
    {
      icon: <User className="w-5 h-5" />,
      label: "Account Details",
      path: "/account/profile",
    },
    {
      icon: <UserRoundPen className="w-5 h-5" />,
      label: "Orders",
      path: "/account/orders",
    },
    {
      icon: <BookMarkedIcon className="w-5 h-5" />,
      label: "Wishlist",
      path: "/account/wishlist",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Security",
      path: "/account/security",
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Account</h2>
        <p className="text-gray-600 text-sm">Manage your account settings</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
