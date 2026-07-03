import { createContext, useState } from "react";

export const MatchContext = createContext();

function MatchProvider({ children }) {

  const [score, setScore] = useState({
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    completed: false,
  });

  const [recentBalls, setRecentBalls] = useState([]);

  const [batting, setBatting] = useState([]);

  const [bowling, setBowling] = useState([]);

  return (
    <MatchContext.Provider
      value={{
        score,
        setScore,
        recentBalls,
        setRecentBalls,
        batting,
        setBatting,
        bowling,
        setBowling,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export default MatchProvider;