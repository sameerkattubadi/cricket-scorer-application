import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { MatchContext } from "../context/MatchContext";
import {
  getMatchById,
  addBall,
  getBatting,
  getBowling,
  addBatsman,
  addBowler,
  getPlayersByTeam,
} from "../services/api";

import ScoreSummary from "../components/ScoreSummary";
import BallControls from "../components/BallControls";
import RecentBalls from "../components/RecentBalls";
import BattingTable from "../components/BattingTable";
import BowlingTable from "../components/BowlingTable";

function LiveScoring() {
  const { matchId } = useParams();

  const {
    score,
    setScore,
    recentBalls,
    setRecentBalls,
    batting,
    setBatting,
    bowling,
    setBowling,
  } = useContext(MatchContext);

  const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);

  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [isWicketModal, setIsWicketModal] = useState(false);
  const [showNoBallModal, setShowNoBallModal] = useState(false);
  const [showWicketModeModal, setShowWicketModeModal] = useState(false);

  const [selectedBatsman, setSelectedBatsman] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [modalError, setModalError] = useState("");

  const [strikerName, setStrikerName] = useState(null);
  const [nonStrikerName, setNonStrikerName] = useState(null);
  const [currentBowlerName, setCurrentBowlerName] = useState(null);
  const [lastBowlerName, setLastBowlerName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  // No Ball Modal State
  const [nbRuns, setNbRuns] = useState(0);
  const [nbRunOut, setNbRunOut] = useState(false);

  // Wicket Mode State
  const [wicketDismissalMode, setWicketDismissalMode] = useState("BOWLED");

  const dismissalModes = [
    { value: "BOWLED", label: "Bowled" },
    { value: "CAUGHT", label: "Caught" },
    { value: "LBW", label: "LBW" },
    { value: "STUMPED", label: "Stumped" },
    { value: "HIT_WICKET", label: "Hit Wicket" },
    { value: "RUN_OUT", label: "Run Out" },
  ];

  const loadMatch = useCallback(async ({ silent = false } = {}) => {
    if (!matchId) return;

    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setErrorMessage("");

    try {
      const res = await getMatchById(matchId);
      const m = res.data;

      let battingTeam = "";
      let bowlingTeam = "";

      if (m.innings === 1) {
        if (m.decision === "BAT") {
          battingTeam = m.tossWinner;
          bowlingTeam = m.tossWinner === m.team1 ? m.team2 : m.team1;
        } else {
          battingTeam = m.tossWinner === m.team1 ? m.team2 : m.team1;
          bowlingTeam = m.tossWinner;
        }
      } else {
        battingTeam =
          m.secondBattingTeam ||
          (m.decision === "BAT"
            ? m.tossWinner === m.team1
              ? m.team2
              : m.team1
            : m.tossWinner);

        bowlingTeam =
          m.firstBattingTeam ||
          (m.decision === "BAT"
            ? m.tossWinner
            : m.tossWinner === m.team1
            ? m.team2
            : m.team1);
      }

      const nextMatch = { ...m, currentBattingTeam: battingTeam };
      setScore(nextMatch);

      if (battingTeam) {
        const r = await getPlayersByTeam(matchId, battingTeam);
        setBattingTeamPlayers(r.data || []);
      } else {
        setBattingTeamPlayers([]);
      }

      if (bowlingTeam) {
        const r = await getPlayersByTeam(matchId, bowlingTeam);
        setBowlingTeamPlayers(r.data || []);
      } else {
        setBowlingTeamPlayers([]);
      }

      const battingRes = await getBatting(matchId);
      const allBatsmen = battingRes.data || [];
      setBatting(allBatsmen);

      if (m.strikerBatsmanId) {
        const striker = allBatsmen.find((b) => b.id === m.strikerBatsmanId);
        setStrikerName(striker?.playerName || null);
      } else {
        setStrikerName(null);
      }

      if (m.nonStrikerBatsmanId) {
        const nonStriker = allBatsmen.find((b) => b.id === m.nonStrikerBatsmanId);
        setNonStrikerName(nonStriker?.playerName || null);
      } else {
        setNonStrikerName(null);
      }

      const bowlingRes = await getBowling(matchId);
      const allBowlers = bowlingRes.data || [];
      setBowling(allBowlers);

      if (m.currentBowlerId) {
        const currentBowler = allBowlers.find((b) => b.id === m.currentBowlerId);
        setCurrentBowlerName(currentBowler?.playerName || null);
      } else {
        setCurrentBowlerName(null);
      }

      if (m.lastBowlerId) {
        const lastBowler = allBowlers.find((b) => b.id === m.lastBowlerId);
        setLastBowlerName(lastBowler?.playerName || null);
      } else {
        setLastBowlerName(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Unable to load match data right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [matchId, setBatting, setBowling, setScore]);

  useEffect(() => {
    loadMatch();

    const intervalId = window.setInterval(() => {
      loadMatch({ silent: true });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadMatch]);

  const activeBatsmen = batting.filter((b) => !b.outStatus).length;

  const isReady =
    activeBatsmen >= 2 &&
    currentBowlerName !== null &&
    !score.completed &&
    !isLoading;

  const notReadyReason = score.completed
    ? null
    : activeBatsmen < 2
    ? `Need ${2 - activeBatsmen} more batsman`
    : !currentBowlerName
    ? "Select a bowler to start"
    : null;

  const handleRefresh = () => {
    setNoticeMessage("");
    loadMatch({ silent: false });
  };

  const handleAddBall = async (type) => {
    setErrorMessage("");
    setNoticeMessage("");

    try {
      // Handle No Ball separately
      if (type === "NB") {
        setNbRuns(0);
        setNbRunOut(false);
        setShowNoBallModal(true);
        return;
      }

      // Handle Wicket with mode selector
      if (type === "W") {
        setWicketDismissalMode("BOWLED");
        setShowWicketModeModal(true);
        return;
      }

      const payload = {
        runs: 0,
        wicket: false,
        extraType: "NONE",
        dismissalMode: null,
      };

      switch (type) {
        case "0":
          payload.runs = 0;
          break;
        case "1":
          payload.runs = 1;
          break;
        case "2":
          payload.runs = 2;
          break;
        case "3":
          payload.runs = 3;
          break;
        case "4":
          payload.runs = 4;
          break;
        case "6":
          payload.runs = 6;
          break;
        case "WD":
          payload.runs = 1;
          payload.extraType = "WIDE";
          break;
        default:
          return;
      }

      const res = await addBall(matchId, payload);
      if (res.data.message) {
        setNoticeMessage(res.data.message);
        return;
      }

      const updatedMatch = res.data;

      setScore(updatedMatch);
      setRecentBalls((prev) => [...prev, type]);
      await loadMatch({ silent: true });

      // Only show bowler modal if:
      // 1. Match not completed
      // 2. Exactly 6 legal balls bowled
      // 3. NOT on a no ball or wide (they don't count as legal balls)
      if (
        !updatedMatch.completed &&
        updatedMatch.balls > 0 &&
        updatedMatch.balls % 6 === 0
      ) {
        setModalError("");
        setShowBowlerModal(true);
      }

      setNoticeMessage(`${type} recorded successfully.`);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Failed to record the ball.");
    }
  };

  // Handle Wicket with Dismissal Mode
  const handleWicketSubmit = async () => {
    try {
      const payload = {
        runs: 0,
        wicket: true,
        extraType: "NONE",
        dismissalMode: wicketDismissalMode,
      };

      const res = await addBall(matchId, payload);

      if (res.data.message) {
        setNoticeMessage(res.data.message);
        return;
      }

      const updatedMatch = res.data;

      setScore(updatedMatch);
      setRecentBalls((prev) => [...prev, "W"]);
      await loadMatch({ silent: true });

      // Only show batsman modal if:
      // 1. Match not completed
      // 2. Wickets < 10
      // 3. NOT on a free hit (free hit wickets don't count except RUN_OUT)
      // 4. Dismissal mode is not RUN_OUT (RUN_OUT on free hit counts)
      const wasOnFreeHit = score.nextBallIsFreeHit;
      const shouldShowBatsmanModal =
        !updatedMatch.completed &&
        (updatedMatch.wickets ?? 0) < 10 &&
        !(wasOnFreeHit && wicketDismissalMode !== "RUN_OUT");

      if (shouldShowBatsmanModal) {
        setIsWicketModal(true);
        setShowBatsmanModal(true);
      }

      if (
        !updatedMatch.completed &&
        updatedMatch.balls > 0 &&
        updatedMatch.balls % 6 === 0
      ) {
        setShowBowlerModal(true);
      }

      setShowWicketModeModal(false);
      setNoticeMessage("Wicket recorded successfully.");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Failed to record wicket."
      );
    }
  };

  // Handle No Ball with custom runs
  const handleNoBallSubmit = async () => {
    try {
      const payload = {
        runs: nbRuns + 1, // Always +1 for the no ball itself
        wicket: nbRunOut,
        extraType: "NO_BALL",
        dismissalMode: nbRunOut ? "RUN_OUT" : null,
      };

      const res = await addBall(matchId, payload);

      if (res.data.message) {
        setNoticeMessage(res.data.message);
        return;
      }

      const updatedMatch = res.data;

      setScore(updatedMatch);

      let recent = "NB";

      if (nbRuns > 0) recent += `+${nbRuns}`;

      if (nbRunOut) recent += "W";

      setRecentBalls((prev) => [...prev, recent]);

      await loadMatch({ silent: true });

      // Only show batsman modal if:
      // 1. Run out on no ball
      // 2. Match not completed
      // 3. Wickets < 10
      if (nbRunOut && !updatedMatch.completed && (updatedMatch.wickets ?? 0) < 10) {
        setIsWicketModal(true);
        setShowBatsmanModal(true);
      }

      // NO bowler modal on no ball - no ball doesn't count as legal delivery
      // So even if 6 deliveries were bowled, if they were all no balls,
      // the over is not complete

      setShowNoBallModal(false);
      setNoticeMessage("No Ball recorded successfully.");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Failed to record No Ball."
      );
    }
  };

  const handleAddBatsman = async () => {
    if (!selectedBatsman) {
      setModalError("Please select a batsman");
      return;
    }

    try {
      const res = await addBatsman(matchId, {
        playerName: selectedBatsman,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        outStatus: false,
      });

      if (res.data.message) {
        setModalError(res.data.message);
        return;
      }

      setSelectedBatsman("");
      setModalError("");
      setShowBatsmanModal(false);
      setIsWicketModal(false);
      setNoticeMessage("Batsman added successfully.");
      await loadMatch({ silent: true });
    } catch (err) {
      setModalError(err?.response?.data?.message || "Failed to add batsman");
    }
  };

  const handleAddBowler = async () => {
    if (!selectedBowler) {
      setModalError("Please select a bowler");
      return;
    }

    try {
      const res = await addBowler(matchId, {
        playerName: selectedBowler,
        overs: 0,
        runs: 0,
        wickets: 0,
      });

      if (res.data.message) {
        setModalError(res.data.message);
        return;
      }

      setSelectedBowler("");
      setModalError("");
      setShowBowlerModal(false);
      setNoticeMessage("Bowler updated successfully.");
      await loadMatch({ silent: true });
    } catch (err) {
      setModalError(err?.response?.data?.message || "Failed to add bowler");
    }
  };

  const alreadyBattedNames = new Set(batting.map((b) => b.playerName));
  const availableBatsmen = battingTeamPlayers.filter((p) => !alreadyBattedNames.has(p.playerName));

  function getMaxOvers() {
    if (!score.format) return 4;
    if (score.format === "TEST") return Infinity;
    return (score.overs || 20) / 5;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Live scoring dashboard</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keep the match updates flowing in real time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ↻ Refresh
          </button>
          <Link
            to={`/match/${matchId}/scorecard`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            📋 View Full Scorecard
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          ⚠️ {errorMessage}
        </div>
      )}

      {noticeMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          ✅ {noticeMessage}
        </div>
      )}

      {isLoading ? (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <p className="font-semibold">Loading live match data…</p>
          <p className="mt-1 text-sm">Connecting to your backend scorer.</p>
        </div>
      ) : (
        <ScoreSummary match={score} />
      )}

      {score.completed && (
        <div className="mt-4 rounded-xl border border-green-300 bg-green-100 p-4 text-center dark:border-green-700 dark:bg-green-900/40">
          <p className="text-lg font-bold text-green-800 dark:text-green-300">🏆 Match Finished!</p>
          {score.winner && (
            <p className="mt-1 font-semibold text-green-700 dark:text-green-400">Winner: {score.winner}</p>
          )}
          {score.result && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">{score.result}</p>
          )}
        </div>
      )}

      {!score.completed && (
        <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl bg-slate-800 px-5 py-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">Striker</span>
            {strikerName ? (
              <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-yellow-900">🏏 {strikerName} *</span>
            ) : (
              <span className="text-sm italic text-slate-500">Not set</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">Non-striker</span>
            {nonStrikerName ? (
              <span className="rounded-full bg-slate-600 px-3 py-1 text-sm font-medium text-white">{nonStrikerName}</span>
            ) : (
              <span className="text-sm italic text-slate-500">Not set</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">Bowling</span>
            {currentBowlerName ? (
              <span className="rounded-full bg-violet-500 px-3 py-1 text-sm font-bold text-white">🎯 {currentBowlerName}</span>
            ) : (
              <span className="text-sm italic text-slate-500">Not set</span>
            )}
          </div>
        </div>
      )}

      {notReadyReason && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-900/30">
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">⚠️ {notReadyReason}</span>
        </div>
      )}

      <div className="mt-4">
        {isReady ? (
          <BallControls addBall={handleAddBall} completed={score.completed} isLoading={isLoading || isRefreshing} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 opacity-50 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Record Ball</p>
            <div className="flex flex-wrap gap-2">
              {["0", "1", "2", "3", "4", "6", "W", "WD", "NB"].map((b) => (
                <div key={b} className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 font-bold text-slate-400 dark:bg-slate-700">
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <RecentBalls recentBalls={recentBalls} />
      </div>

      <hr className="my-6 border-slate-200 dark:border-slate-700" />

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">🏏 Batting</h2>
          {!score.completed && (
            <button
              onClick={() => {
                setModalError("");
                setIsWicketModal(false);
                setShowBatsmanModal(true);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + Add Batsman
            </button>
          )}
        </div>
        <BattingTable batting={batting} strikerId={score.strikerBatsmanId} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">🎯 Bowling</h2>
          {!score.completed && (
            <button
              onClick={() => {
                setModalError("");
                setShowBowlerModal(true);
              }}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              + Change Bowler
            </button>
          )}
        </div>
        <BowlingTable bowling={bowling} currentBowlerId={score.currentBowlerId} />
      </div>

      {/* Wicket Dismissal Mode Modal */}
      {showWicketModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">🏏 How was the batsman out?</h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Select the dismissal mode</p>

            <div className="mb-6 flex flex-col gap-2">
              {dismissalModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setWicketDismissalMode(mode.value)}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    wicketDismissalMode === mode.value
                      ? "border-blue-500 bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWicketModeModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleWicketSubmit}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Record Wicket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Ball Modal */}
      {showNoBallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">⚠️ No Ball</h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Record the additional details</p>

            <div className="mb-5">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Batsman Runs
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 6].map((r) => (
                  <button
                    key={r}
                    onClick={() => setNbRuns(r)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      nbRuns === r
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <input
                type="checkbox"
                id="nbRunOut"
                checked={nbRunOut}
                onChange={(e) => setNbRunOut(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              <label htmlFor="nbRunOut" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Run Out on No Ball
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNoBallModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleNoBallSubmit}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Record No Ball
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batsman Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="mb-1 text-lg font-bold text-slate-800 dark:text-white">
              {isWicketModal ? "🏏 Wicket! Select Next Batsman" : "🏏 Select Batsman"}
            </h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Choose from the batting team squad</p>

            {modalError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
                ⚠️ {modalError}
              </div>
            )}

            {availableBatsmen.length === 0 ? (
              <p className="mb-4 text-sm italic text-slate-400">All players have batted</p>
            ) : (
              <div className="mb-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
                {availableBatsmen.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedBatsman(p.playerName)}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      selectedBatsman === p.playerName
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="font-medium">{p.playerName}</span>
                    <span className="ml-2 text-xs text-slate-400">#{p.jerseyNumber}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {!isWicketModal && (
                <button
                  onClick={() => {
                    setShowBatsmanModal(false);
                    setSelectedBatsman("");
                    setModalError("");
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleAddBatsman}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bowler Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="mb-1 text-lg font-bold text-slate-800 dark:text-white">🎯 Select Bowler</h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Choose next over&apos;s bowler</p>

            {modalError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
                ⚠️ {modalError}
              </div>
            )}

            <div className="mb-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
              {bowlingTeamPlayers.map((p) => {
                const existing = bowling.find((b) => b.playerName === p.playerName);
                const oversUsed = existing ? existing.overs : 0;
                const maxOv = getMaxOvers();
                const atLimit = maxOv !== Infinity && oversUsed >= maxOv;
                const isConsecutive =
                  lastBowlerName !== null && lastBowlerName.toLowerCase() === p.playerName.toLowerCase();
                const disabled = atLimit || isConsecutive;

                return (
                  <button
                    key={p.id}
                    onClick={() => !disabled && setSelectedBowler(p.playerName)}
                    disabled={disabled}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      disabled
                        ? "cursor-not-allowed border-slate-100 opacity-40 dark:border-slate-700"
                        : selectedBowler === p.playerName
                        ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.playerName}</span>
                      <span className="text-xs text-slate-400">
                        {oversUsed > 0 ? `${oversUsed} ov` : "Yet to bowl"}
                        {isConsecutive ? " · Consecutive ❌" : atLimit ? " · Limit reached ❌" : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBowlerModal(false);
                  setSelectedBowler("");
                  setModalError("");
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBowler}
                className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveScoring;