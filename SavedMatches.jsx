import { useEffect, useState } from "react";
import { getAllMatches, deleteMatch } from "../services/api";
import MatchCard from "../components/MatchCard";

function SavedMatches() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadMatches();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await deleteMatch(id);
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = matches.filter((m) => {
    if (filter === "LIVE") return !m.completed;
    if (filter === "COMPLETED") return m.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          All Matches
        </h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {matches.length} total
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["ALL", "LIVE", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? "bg-slate-800 dark:bg-slate-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {tab === "ALL" && "All"}
            {tab === "LIVE" && "🟢 Live"}
            {tab === "COMPLETED" && "✅ Completed"}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          Loading matches...
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏏</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No matches found
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            {filter !== "ALL"
              ? "Try switching the filter above"
              : "Create a new match to get started"}
          </p>
        </div>
      )}

      {/* Match List */}
      <div className="flex flex-col gap-4">
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} onDelete={handleDelete} />
        ))}
      </div>

    </div>
  );
}

export default SavedMatches;