// components/UserSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  BookMarked,
  UserRoundPen,
  LogOut,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slice/auth";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface UserSidebarProps {
  onNavigate?: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      dispatch(logout());
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
      label: "Watchlist",
      path: "/account/watchlist",
    },
    {
      icon: <BookMarked className="w-5 h-5" />,
      label: "Reviews",
      path: "/account/reviews",
    },
  ];

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg p-6 h-full border border-gray-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">My Account</h2>
        <p className="text-gray-400 text-sm">Manage your account settings</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-blue-600 text-white border-l-4 border-blue-400 shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-900 text-red-300 rounded-lg hover:bg-red-800 hover:text-red-200 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;