import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchById, getBalls } from "../services/api";

function Scorecard() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    loadMatch();
    loadBalls();
  }, []);

  const loadMatch = async () => {
    try {
      const response = await getMatchById(matchId);
      setMatch(response.data);
    } catch (error) { console.log(error); }
  };

  const loadBalls = async () => {
    try {
      const response = await getBalls(matchId);
      setBalls(response.data);
    } catch (error) { console.log(error); }
  };

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-64 text-slate-400 dark:text-slate-500">
        Loading scorecard...
      </div>
    );
  }

  const oversPlayed = `${Math.floor(match.balls / 6)}.${match.balls % 6}`;

  const getBallStyle = (ball) => {
    if (ball.wicket) return "bg-red-500 text-white";
    if (ball.extraType === "WIDE") return "bg-yellow-400 text-yellow-900";
    if (ball.extraType === "NO_BALL") return "bg-orange-400 text-white";
    if (ball.runs === 4) return "bg-blue-500 text-white";
    if (ball.runs === 6) return "bg-purple-500 text-white";
    return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
  };

  const getBallLabel = (ball) => {
    if (ball.wicket) return "W";
    if (ball.extraType === "WIDE") return "WD";
    if (ball.extraType === "NO_BALL") return "NB";
    return ball.runs;
  };

  const infoRow = (label, value) => (
    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
      <span className="text-slate-800 dark:text-white text-sm font-medium">{value}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="mb-5">
        <Link
          to={`/live-scoring/${matchId}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          ← Back to Live Scoring
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        🏏 Match Scorecard
      </h1>

      {/* Teams header */}
      <div className="bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 text-white rounded-2xl p-6 mb-5 text-center">
        <h2 className="text-2xl font-bold">{match.team1} vs {match.team2}</h2>
        <p className="text-slate-400 text-sm mt-1">{match.format} • {match.overs} Overs</p>
        {match.completed ? (
          <span className="inline-block mt-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            ✅ Completed
          </span>
        ) : (
          <span className="inline-block mt-3 bg-green-400 text-green-900 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
            🟢 Live
          </span>
        )}
      </div>

      {/* Result banner */}
      {match.completed && match.winner && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-5 text-center">
          <p className="text-green-800 dark:text-green-300 font-bold text-lg">🏆 {match.winner} won!</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">{match.result}</p>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Match Info</h3>
          {infoRow("Format", match.format)}
          {infoRow("Overs", match.overs)}
          {infoRow("Toss Winner", match.tossWinner)}
          {infoRow("Decision", match.decision)}
          {infoRow("1st Batting", match.firstBattingTeam || "—")}
          {infoRow("2nd Batting", match.secondBattingTeam || "—")}
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Innings Summary</h3>
          {infoRow("1st Innings Score", match.firstInningsScore ?? "—")}
          {infoRow("Target", match.target ?? "—")}
          {infoRow("Current Score", `${match.score}/${match.wickets}`)}
          {infoRow("Overs Played", oversPlayed)}
          {infoRow("Current Innings", match.innings)}
          {infoRow("Status", match.completed ? "Completed" : "Live")}
        </div>
      </div>

      {/* Ball history */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Ball by Ball</h3>
        {balls.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm italic">No balls recorded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {balls.map((ball) => (
              <div key={ball.id} className="flex flex-col items-center gap-1">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getBallStyle(ball)}`}>
                  {getBallLabel(ball)}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                  {ball.overNumber}.{ball.ballNumber}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Scorecard;