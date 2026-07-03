function ScoreSummary({ match }) {
  if (!match) return null;

  const score = match.score ?? 0;
  const wickets = match.wickets ?? 0;
  const balls = match.balls ?? 0;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const runRate =
    balls > 0 ? ((score / (balls / 6)) || 0).toFixed(2) : "0.00";

  const totalBalls = (match.overs ?? 0) * 6;
  const ballsLeft = Math.max(0, totalBalls - balls);
  const runsNeeded = match.innings === 2 ? (match.target ?? 0) - score : 0;

  const requiredRR =
    match.innings === 2 && ballsLeft > 0 && runsNeeded > 0
      ? ((runsNeeded * 6) / ballsLeft).toFixed(2)
      : "0.00";

  const battingTeam = match.currentBattingTeam || "Batting Team";
  const statusText = match.completed ? "Match complete" : "Live scoring";

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {statusText}
          </p>
          <h2 className="text-2xl font-bold text-emerald-400">🏏 {battingTeam}</h2>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
          {match.format || "Limited Overs"}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          {score}/{wickets}
        </h1>
        <span className="mb-2 text-lg text-slate-400">({overs} ov)</span>
      </div>

      <div className="flex flex-wrap gap-6">
        <div>
          <p className="mb-0.5 text-xs uppercase tracking-wider text-slate-400">Run Rate</p>
          <p className="text-lg font-semibold text-white">{runRate}</p>
        </div>

        <div>
          <p className="mb-0.5 text-xs uppercase tracking-wider text-slate-400">Innings</p>
          <p className="text-lg font-semibold text-white">{match.innings ?? 1}</p>
        </div>

        {match.innings === 2 && (
          <>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wider text-slate-400">Target</p>
              <p className="text-lg font-semibold text-yellow-400">{match.target ?? 0}</p>
            </div>

            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wider text-slate-400">Need</p>
              <p className="text-lg font-semibold text-orange-400">
                {Math.max(0, runsNeeded)} off {ballsLeft}b
              </p>
            </div>

            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wider text-slate-400">Req. RR</p>
              <p className="text-lg font-semibold text-red-400">{requiredRR}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ScoreSummary;