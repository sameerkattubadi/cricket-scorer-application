import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          ⚙️ Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your app preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-slate-700">

        {/* Appearance section */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Appearance
          </p>

          {/* Dark mode row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {theme === "dark"
                  ? "Dark theme is active"
                  : "Light theme is active"}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                theme === "dark" ? "bg-slate-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center text-xs ${
                  theme === "dark" ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </span>
            </button>
          </div>
        </div>

        {/* Theme preview row */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Preview
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Light preview */}
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`rounded-xl border-2 p-3 transition-colors ${
                theme === "light"
                  ? "border-slate-800"
                  : "border-slate-200 dark:border-slate-600"
              }`}
            >
              <div className="bg-white rounded-lg p-2 mb-2">
                <div className="h-2 bg-slate-200 rounded mb-1 w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/2" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                ☀️ Light
              </p>
              {theme === "light" && (
                <p className="text-xs text-slate-400 mt-0.5">Active</p>
              )}
            </button>

            {/* Dark preview */}
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`rounded-xl border-2 p-3 transition-colors ${
                theme === "dark"
                  ? "border-slate-400"
                  : "border-slate-200 dark:border-slate-600"
              }`}
            >
              <div className="bg-slate-800 rounded-lg p-2 mb-2">
                <div className="h-2 bg-slate-600 rounded mb-1 w-3/4" />
                <div className="h-2 bg-slate-700 rounded w-1/2" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                🌙 Dark
              </p>
              {theme === "dark" && (
                <p className="text-xs text-slate-400 mt-0.5">Active</p>
              )}
            </button>
          </div>
        </div>

        {/* App info row */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            About
          </p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">Version</p>
            <p className="text-sm font-medium text-slate-800 dark:text-white">1.0.0</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;