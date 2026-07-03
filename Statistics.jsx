import { useEffect, useState } from "react";
import {
  getStatistics,
  getBattingStats,
  getBowlingStats,
} from "../services/api";

function Statistics() {
  const [stats, setStats] = useState({
    totalMatches: 0,
    highestScore: 0,
    averageScore: 0,
    completedMatches: 0,
    totalRuns: 0,
    totalWickets: 0,
  });

  const [battingStats, setBattingStats] = useState([]);
  const [bowlingStats, setBowlingStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      const [dashRes, battRes, bowlRes] = await Promise.all([
        getStatistics(),
        getBattingStats(),
        getBowlingStats(),
      ]);

      setStats(dashRes.data);
      setBattingStats(battRes.data || []);
      setBowlingStats(bowlRes.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          Loading statistics...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          📊 Cricket Statistics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Comprehensive performance analytics across all your matches
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          Match Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
              Total Matches
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">
              {stats.totalMatches}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase">
              Completed
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
              {stats.completedMatches}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-xl p-3">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">
              Total Runs
            </p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-2">
              {stats.totalRuns}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl p-3">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase">
              Total Wickets
            </p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">
              {stats.totalWickets}
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold uppercase">
              High Score
            </p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
              {stats.highestScore}
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 border border-cyan-200 dark:border-cyan-700 rounded-xl p-3">
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
              Avg Score
            </p>
            <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 mt-2">
              {Number(stats.averageScore).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🏏 Batting Statistics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Individual player performance across all matches
          </p>
        </div>

        {battingStats.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <p className="text-sm">No batting data available</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700/50">
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Player
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Team
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Runs
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Balls
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Average
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    SR (%)
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    4s
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    6s
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {battingStats.map((player, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {player.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        {player.team || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                      {player.runs}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {player.balls}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {player.average ? player.average.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">
                      {player.strikeRate ? player.strikeRate.toFixed(1) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-orange-600 dark:text-orange-400 font-medium">
                      {player.fours}
                    </td>
                    <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">
                      {player.sixes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🎯 Bowling Statistics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Individual player performance across all matches
          </p>
        </div>

        {bowlingStats.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <p className="text-sm">No bowling data available</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700/50">
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Player
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Team
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Overs
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Runs
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Wickets
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    Economy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {bowlingStats.map((player, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-purple-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {player.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        {player.team || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      <span className="font-mono font-medium">
                        {player.overs}.{player.balls}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-orange-600 dark:text-orange-400">
                      {player.runs}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-purple-600 dark:text-purple-400">
                      {player.wickets}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {player.economy ? player.economy.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
