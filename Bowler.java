package com.sameer.cricket.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "bowling_scorecard")
public class Bowler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;
    private String playerName;
    private String teamName;
    private int overs;
    private int ballsBowled;
    private int runs;
    private int wickets;
    private int innings;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public int getOvers() { return overs; }
    public void setOvers(int overs) { this.overs = overs; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public int getBallsBowled() { return ballsBowled; }
    public void setBallsBowled(int ballsBowled) { this.ballsBowled = ballsBowled; }

    public int getInnings() { return innings; }
    public void setInnings(int innings) { this.innings = innings; }
}
