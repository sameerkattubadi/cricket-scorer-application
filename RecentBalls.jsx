function RecentBalls({ recentBalls }) {

  if (!recentBalls || recentBalls.length === 0) return null;

  const getBallStyle = (ball) => {
    if (ball === "W")  return "bg-red-500 text-white";
    if (ball === "4")  return "bg-blue-500 text-white";
    if (ball === "6")  return "bg-purple-500 text-white";
    if (ball === "WD") return "bg-yellow-400 text-yellow-900";
    if (ball === "NB") return "bg-orange-400 text-white";
    return "bg-slate-200 text-slate-700";
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">
        Recent Balls
      </p>
      <div className="flex flex-wrap gap-2">
        {recentBalls
          .slice()
          .reverse()
          .map((ball, index) => (
            <span
              key={index}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${getBallStyle(ball)}`}
            >
              {ball}
            </span>
          ))}
      </div>
    </div>
  );
}

export default RecentBalls;