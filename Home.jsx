import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecentMatches from "../components/RecentMatches";
import { getAllMatches } from "../services/api";

function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await getAllMatches();
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const liveMatches = matches.filter((m) => !m.completed);
  const recentMatches = matches.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 text-white rounded-2xl p-8 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">🏏 Cricket Scorer</h1>
          <p className="text-slate-400 text-sm">Track live matches, scorecards & stats</p>
        </div>
        <Link
          to="/create-match"
          className="bg-white text-slate-900 font-semibold px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm shrink-0"
        >
          + New Match
        </Link>
      </div>

      {/* Live now */}
      {liveMatches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping inline-block" />
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Live Now
            </h2>
          </div>
          <RecentMatches matches={liveMatches} />
        </div>
      )}

      {/* Recent matches */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          Recent Matches
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            Loading...
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-4xl mb-3">🏏</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No matches yet</p>
            <Link
              to="/create-match"
              className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create your first match →
            </Link>
          </div>
        ) : (
          <RecentMatches matches={recentMatches} />
        )}
      </div>

    </div>
  );
}

export default Home;