import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMatch, addPlayer } from "../services/api";

const STEPS = ["Match Details", "Team 1 Squad", "Team 2 Squad"];

function CreateMatch() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [match, setMatch] = useState({
    team1: "",
    team2: "",
    format: "T20",
    overs: 20,
    tossWinner: "",
    decision: "BAT",
  });

  const [team1Players, setTeam1Players] = useState(
    Array(11).fill("").map((_, i) => ({
      name: "", jersey: i + 1
    }))
  );

  const [team2Players, setTeam2Players] = useState(
    Array(11).fill("").map((_, i) => ({
      name: "", jersey: i + 1
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatchChange = (e) => {
    const val = e.target.name === "overs"
      ? Number(e.target.value)
      : e.target.value;
    setMatch({ ...match, [e.target.name]: val });
  };

  const handleFormatChange = (e) => {
    const format = e.target.value;
    const overs = format === "T20" ? 20
      : format === "ODI" ? 50 : 90;
    setMatch({ ...match, format, overs });
  };

  const handlePlayerName = (team, index, value) => {
    if (team === 1) {
      const updated = [...team1Players];
      updated[index] = { ...updated[index], name: value };
      setTeam1Players(updated);
    } else {
      const updated = [...team2Players];
      updated[index] = { ...updated[index], name: value };
      setTeam2Players(updated);
    }
  };

  const validateStep0 = () => {
    if (!match.team1.trim() || !match.team2.trim()) {
      setError("Both team names are required");
      return false;
    }
    if (!match.tossWinner.trim()) {
      setError("Toss winner is required");
      return false;
    }
    if (match.team1.trim() === match.team2.trim()) {
      setError("Team names must be different");
      return false;
    }
    return true;
  };

  const validatePlayers = (players, teamName) => {
    const filled = players.filter(p => p.name.trim());
    if (filled.length < 11) {
      setError(`Please enter all 11 players for ${teamName}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validatePlayers(
        team1Players, match.team1)) return;
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError("");
    if (!validatePlayers(team2Players, match.team2)) return;

    setLoading(true);
    try {
      // Create match
      const response = await createMatch({
        ...match,
        score: 0,
        wickets: 0,
        balls: 0,
        innings: 1,
        target: 0,
        completed: false,
      });

      const matchId = response.data.id;

      // Save team 1 players
      for (const p of team1Players) {
        if (p.name.trim()) {
          await addPlayer(matchId, {
            teamName: match.team1,
            playerName: p.name.trim(),
            jerseyNumber: p.jersey,
          });
        }
      }

      // Save team 2 players
      for (const p of team2Players) {
        if (p.name.trim()) {
          await addPlayer(matchId, {
            teamName: match.team2,
            playerName: p.name.trim(),
            jerseyNumber: p.jersey,
          });
        }
      }

      navigate(`/live-scoring/${matchId}`);
    } catch (err) {
      setError("Failed to create match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
  const inputClass =
    "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          🏏 Create New Match
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {STEPS[step]}
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i < step
                ? "bg-green-500 text-white"
                : i === step
                ? "bg-slate-900 dark:bg-slate-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${
              i === step
                ? "text-slate-800 dark:text-white font-medium"
                : "text-slate-400"
            }`}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                i < step
                  ? "bg-green-500"
                  : "bg-slate-200 dark:bg-slate-700"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">

        {/* Step 0 — Match Details */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Team 1</label>
                <input
                  type="text"
                  name="team1"
                  value={match.team1}
                  onChange={handleMatchChange}
                  placeholder="e.g. India"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Team 2</label>
                <input
                  type="text"
                  name="team2"
                  value={match.team2}
                  onChange={handleMatchChange}
                  placeholder="e.g. Australia"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Format</label>
                <select
                  name="format"
                  value={match.format}
                  onChange={handleFormatChange}
                  className={inputClass}
                >
                  <option value="T20">T20 (20 overs)</option>
                  <option value="ODI">ODI (50 overs)</option>
                  <option value="TEST">TEST (unlimited)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Overs</label>
                <input
                  type="number"
                  name="overs"
                  value={match.overs}
                  onChange={handleMatchChange}
                  min={1}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Toss Winner</label>
                <select
                  name="tossWinner"
                  value={match.tossWinner}
                  onChange={handleMatchChange}
                  className={inputClass}
                >
                  <option value="">Select team</option>
                  {match.team1 && (
                    <option value={match.team1}>
                      {match.team1}
                    </option>
                  )}
                  {match.team2 && (
                    <option value={match.team2}>
                      {match.team2}
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label className={labelClass}>Decision</label>
                <select
                  name="decision"
                  value={match.decision}
                  onChange={handleMatchChange}
                  className={inputClass}
                >
                  <option value="BAT">Bat First</option>
                  <option value="BOWL">Bowl First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Team 1 Players */}
        {step === 1 && (
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
              {match.team1} — Enter 11 Players
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {team1Players.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      handlePlayerName(1, i, e.target.value)
                    }
                    placeholder={`Player ${i + 1}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Team 2 Players */}
        {step === 2 && (
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
              {match.team2} — Enter 11 Players
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {team2Players.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      handlePlayerName(2, i, e.target.value)
                    }
                    placeholder={`Player ${i + 1}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <button
            onClick={() => { setStep(step - 1); setError(""); }}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← Back
          </button>
        ) : <div />}

        {step < 2 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Creating..." : "🏏 Start Match"}
          </button>
        )}
      </div>

    </div>
  );
}

export default CreateMatch;