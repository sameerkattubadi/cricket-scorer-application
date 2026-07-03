import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CreateMatch from "./pages/CreateMatch";
import LiveScoring from "./pages/LiveScoring";
import Scorecard from "./pages/Scorecard";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import SavedMatches from "./pages/SavedMatches";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AuthProvider from "./context/AuthContext";
import MatchProvider from "./context/MatchContext";

function AppContent() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <AuthProvider>
        <MatchProvider>
          <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{
              backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
              color: theme === "dark" ? "#f1f5f9" : "#1e293b",
            }}
          >
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/create-match" element={<ProtectedRoute><CreateMatch /></ProtectedRoute>} />
                <Route path="/live-scoring/:matchId" element={<ProtectedRoute><LiveScoring /></ProtectedRoute>} />
                <Route path="/saved-matches" element={<ProtectedRoute><SavedMatches /></ProtectedRoute>} />
                <Route path="/match/:matchId/scorecard" element={<ProtectedRoute><Scorecard /></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </main>

            <Footer />
          </div>
        </MatchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ThemeProvider wraps AppContent so useTheme() works inside it
import ThemeProvider from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;