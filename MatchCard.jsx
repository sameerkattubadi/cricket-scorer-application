import { Link } from "react-router-dom";

function MatchCard({ match, onDelete }) {
  const overs = `${Math.floor(match.balls / 6)}.${match.balls % 6}`;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          {match.team1} vs {match.team2}
        </h3>
        {match.completed ? (
          <span className="shrink-0 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ Completed
          </span>
        ) : (
          <span className="shrink-0 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
            🟢 Live
          </span>
        )}
      </div>

      {/* Match info */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
        <span>📋 {match.format}</span>
        <span>🕐 {match.overs} Overs</span>
        <span>⚾ Overs played: {overs}</span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">
          {match.score}/{match.wickets}
        </span>
        {match.innings === 2 && match.target && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            • Target: {match.target}
          </span>
        )}
      </div>

      {/* Winner */}
      {match.completed && match.result && (
        <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-3">
          🏆 {match.winner} — {match.result}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        {match.completed ? (
          <Link
            to={`/match/${match.id}/scorecard`}
            className="text-sm bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Scorecard
          </Link>
        ) : (
          <Link
            to={`/live-scoring/${match.id}`}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            ▶ Continue Match
          </Link>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(match.id)}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            🗑 Delete
          </button>
        )}
      </div>

    </div>
  );
}

export default MatchCard;