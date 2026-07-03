function BattingTable({ batting, strikerId }) {

  if (!batting || batting.length === 0) {
    return (
      <p className="text-slate-400 dark:text-slate-500 italic text-sm py-2">
        No batsmen added yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 dark:bg-slate-900 text-white">
            <th className="px-4 py-3 text-left font-semibold">Batsman</th>
            <th className="px-4 py-3 text-center font-semibold">R</th>
            <th className="px-4 py-3 text-center font-semibold">B</th>
            <th className="px-4 py-3 text-center font-semibold">4s</th>
            <th className="px-4 py-3 text-center font-semibold">6s</th>
            <th className="px-4 py-3 text-center font-semibold">SR</th>
            <th className="px-4 py-3 text-center font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {batting.map((player, index) => {
            const sr = player.balls > 0
              ? ((player.runs / player.balls) * 100)
                  .toFixed(1)
              : "0.0";
            const isOut = player.outStatus;
            const isStriker =
              strikerId && player.id === strikerId;

            return (
              <tr
                key={player.id ?? index}
                className={`border-t border-slate-100 dark:border-slate-700 ${
                  isOut
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-800 dark:text-white"
                } ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-800"
                    : "bg-slate-50 dark:bg-slate-800"
                }`}
              >
                <td className="px-4 py-3 font-medium">
                  <span>
                    {player.playerName ?? player.name}
                  </span>
                  {isStriker && (
                    <span className="ml-2 text-yellow-500 font-bold text-xs">
                      ★ batting
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-bold">
                  {player.runs}
                </td>
                <td className="px-4 py-3 text-center">
                  {player.balls}
                </td>
                <td className="px-4 py-3 text-center">
                  {player.fours ?? 0}
                </td>
                <td className="px-4 py-3 text-center">
                  {player.sixes ?? 0}
                </td>
                <td className="px-4 py-3 text-center">
                  {sr}
                </td>
                <td className="px-4 py-3 text-center">
                  {isOut ? (
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold px-2 py-1 rounded-full">
                      Out
                    </span>
                  ) : (
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                      Batting
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BattingTable;