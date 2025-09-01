import React, { useState, useEffect } from "react";
import { Menu, X, User, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isMenuOpen && sidebar && !sidebar.contains(target) && !menuButton?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/movies');
    }
    
    setIsSearchExpanded(false);
    setIsMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <header className="bg-gray-900 shadow-lg border-b border-gray-700 relative z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  Movies
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/movies"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-800"
              >
                Movies
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* CTA Buttons */}
            {user?.role === "guest" ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Link
                  to="/account/profile"
                  className="flex items-center bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleSearch}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                id="menu-button"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Expanded */}
          {isSearchExpanded && (
            <div className="md:hidden border-t border-gray-700 py-4">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {searchTerm.trim() ? 'Search Movies' : 'Browse All Movies'}
                </button>
              </form>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/30 transition-opacity" />
          
          {/* Sidebar */}
          <div
            id="mobile-sidebar"
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                Movies
              </div>
              <button
                onClick={closeMenu}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                <Link
                  to="/"
                  className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-base font-medium rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  to="/movies"
                  className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-base font-medium rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Movies
                </Link>

                {/* User Profile (if logged in) */}
                {user?.role !== "guest" && (
                  <Link
                    to="/account/profile"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-base font-medium rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                )}
              </nav>

              {/* CTA Buttons */}
              {user?.role === "guest" && (
                <div className="p-4 border-t border-gray-700 space-y-3">
                  <Link
                    to="/signin"
                    className="block w-full text-center text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-base font-medium rounded-lg transition-colors border border-gray-600"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 text-base font-medium rounded-lg transition-all shadow-lg"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingHeader;
