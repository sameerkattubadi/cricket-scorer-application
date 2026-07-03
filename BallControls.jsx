function BallControls({ addBall, completed, isLoading }) {
  if (completed) return null;

  const runBtns = ["0", "1", "2", "3", "4", "6"];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        Record Ball
      </p>

      <div className="flex flex-wrap gap-2">
        {runBtns.map((r) => (
          <button
            key={r}
            onClick={() => addBall(r)}
            disabled={isLoading}
            className={`h-12 w-12 rounded-xl text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              r === "4"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : r === "6"
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {r}
          </button>
        ))}

        <div className="mx-1 w-px bg-slate-200" />

        <button
          onClick={() => addBall("W")}
          disabled={isLoading}
          className="h-12 rounded-xl bg-red-100 px-4 text-base font-bold text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          W
        </button>

        <button
          onClick={() => addBall("WD")}
          disabled={isLoading}
          className="h-12 rounded-xl bg-yellow-100 px-4 text-base font-bold text-yellow-700 transition-colors hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          WD
        </button>

        <button
          onClick={() => addBall("NB")}
          disabled={isLoading}
          className="h-12 rounded-xl bg-orange-100 px-4 text-base font-bold text-orange-700 transition-colors hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          NB
        </button>
      </div>
    </div>
  );
}

export default BallControls;