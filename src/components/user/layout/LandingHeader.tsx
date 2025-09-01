import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <div className="bg-blue-600 text-white px-3 py-2 rounded-md text-lg font-bold">
                Movies
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/movies"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Movies
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          {user?.role === "guest" ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <Link
                to="/profile"
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 text-base font-medium rounded-md transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;
