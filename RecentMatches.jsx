import MatchCard from "./MatchCard";

function RecentMatches({ matches }) {
  return (
    <div>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
        />
      ))}
    </div>
  );
}

export default RecentMatches;