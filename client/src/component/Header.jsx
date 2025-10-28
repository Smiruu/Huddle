import React, { useState } from "react";
import { Sun, Moon, Menu, X, LogOut, Plus, User } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { shallow } from "zustand/shallow"; // Import shallow

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate(); // Hook for navigation

  // 1. Get auth state and actions using efficient selectors
  const { profile, user, isAuthenticated} = useAuthStore(
  );

  console.log(profile.username)
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logoutUser();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login"); // Redirect to login after logout
  };

  const handleSignIn = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-huddle-light/80 dark:bg-huddle-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-huddle-orange"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-huddle-text-light dark:text-huddle-text-dark">
              Huddle
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 2. Show theme toggle for everyone */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-huddle-orange"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* 3. Conditionally render buttons based on auth state */}
            {isAuthenticated ? (
              <>
                <button className="bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center space-x-2 cursor-pointer ">
                  <Plus size={20} />
                  <span>Post a Huddle</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={`https://placehold.co/100x100/111827/FF7A59?text=${
                        profile?.username?.charAt(0)
                      }`}
                      alt="User Profile"
                    />
                    <span className="hidden md:block font-semibold text-huddle-text-light dark:text-huddle-text-dark">
                      {profile?.username}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not Authenticated: Show Sign In Button
              <button
                onClick={handleSignIn}
                className="bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center space-x-2 cursor-pointer "
              >
                <Plus size={20} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Burger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-huddle-text-light dark:text-huddle-text-dark focus:outline-none focus:ring-2 focus:ring-huddle-orange"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
              {/* 4. Conditional Mobile Menu */}
              {isAuthenticated ? (
                <>
                  <button className="w-full bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ">
                    <Plus size={20} />
                    <span>Post a Huddle</span>
                  </button>

                  <Link
                    to="/profile"
                    className="w-full flex items-center justify-between space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={`https://placehold.co/100x100/111827/FF7A59?text=${
                          profile?.username?.charAt(0)
                        }`}
                        alt="User Profile"
                      />
                      <span className="font-semibold text-huddle-text-light dark:text-huddle-text-dark">
                        {profile?.username}
                      </span>
                    </div>
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex justify-between items-center p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-500 focus:outline-none"
                    aria-label="Sign out"
                  >
                    <span className="font-medium">Sign Out</span>
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                // Not Authenticated: Show Sign In
                <button
                  onClick={handleSignIn}
                  className="w-full bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer "
                >
                  <Plus size={20} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
