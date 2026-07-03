package com.sameer.cricket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "batting_scorecard")
public class Batsman {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;
    private String playerName;
    private String teamName;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private boolean outStatus;
    private int innings;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getBalls() { return balls; }
    public void setBalls(int balls) { this.balls = balls; }

    public int getFours() { return fours; }
    public void setFours(int fours) { this.fours = fours; }

    public int getSixes() { return sixes; }
    public void setSixes(int sixes) { this.sixes = sixes; }

    public boolean isOutStatus() { return outStatus; }
    public void setOutStatus(boolean outStatus) { this.outStatus = outStatus; }

    public int getInnings() { return innings; }
    public void setInnings(int innings) { this.innings = innings; }
}
