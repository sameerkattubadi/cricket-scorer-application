import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoggedIn } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create-match", label: "Create Match" },
    { to: "/saved-matches", label: "Matches" },
    { to: "/statistics", label: "Statistics" },
  ];

  // Get initials from name for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between shadow-md">

      {/* Logo */}
      <Link
        to="/"
        className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
      >
        🏏 Cricket Scorer
      </Link>

      <div className="flex items-center gap-1">

        {/* Nav links */}
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="ml-2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-lg"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Auth section */}
        {isLoggedIn ? (
          // Logged in — avatar + dropdown
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 transition-colors rounded-xl px-3 py-2"
            >
              {/* Avatar circle with initials */}
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <span className="text-sm font-medium text-slate-200 max-w-24 truncate">
                {user?.name?.split(" ")[0]}
              </span>
              <svg
                className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">

                {/* User info header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    ⚙️ Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Logged out — Login + Signup buttons
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;