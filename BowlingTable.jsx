function BowlingTable({ bowling, currentBowlerId }) {

  if (!bowling || bowling.length === 0) {
    return (
      <p className="text-slate-400 dark:text-slate-500 italic text-sm py-2">
        No bowlers added yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 dark:bg-slate-900 text-white">
            <th className="px-4 py-3 text-left font-semibold">Bowler</th>
            <th className="px-4 py-3 text-center font-semibold">O</th>
            <th className="px-4 py-3 text-center font-semibold">R</th>
            <th className="px-4 py-3 text-center font-semibold">W</th>
            <th className="px-4 py-3 text-center font-semibold">Econ</th>
          </tr>
        </thead>
        <tbody>
          {bowling.map((player, index) => {
            const econ = player.overs > 0
              ? (player.runs / player.overs)
                  .toFixed(2)
              : "0.00";
            const isCurrent =
              currentBowlerId &&
              player.id === currentBowlerId;

            return (
              <tr
                key={player.id ?? index}
                className={`border-t border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-800"
                    : "bg-slate-50 dark:bg-slate-800"
                }`}
              >
                <td className="px-4 py-3 font-medium">
                  <span>
                    {player.playerName ?? player.name}
                  </span>
                  {isCurrent && (
                    <span className="ml-2 text-violet-500 font-bold text-xs">
                      ★ bowling
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {player.overs}
                </td>
                <td className="px-4 py-3 text-center">
                  {player.runs}
                </td>
                <td className="px-4 py-3 text-center font-bold">
                  {player.wickets}
                </td>
                <td className="px-4 py-3 text-center">
                  {econ}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BowlingTable;