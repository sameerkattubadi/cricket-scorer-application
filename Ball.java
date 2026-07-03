package com.sameer.cricket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ball_by_ball")
public class Ball {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;

    private int overNumber;

    private int ballNumber;

    private int runs;

    private int batsmanRuns; // Batsman runs only (used for No Balls)

    private boolean wicket;

    private String extraType;

    private boolean freeHit;

    public Ball() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public int getOverNumber() { return overNumber; }
    public void setOverNumber(int overNumber) { this.overNumber = overNumber; }

    public int getBallNumber() { return ballNumber; }
    public void setBallNumber(int ballNumber) { this.ballNumber = ballNumber; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getBatsmanRuns() { return batsmanRuns; }
    public void setBatsmanRuns(int batsmanRuns) { this.batsmanRuns = batsmanRuns; }

    public boolean isWicket() { return wicket; }
    public void setWicket(boolean wicket) { this.wicket = wicket; }

    public String getExtraType() { return extraType; }
    public void setExtraType(String extraType) { this.extraType = extraType; }

    public boolean isFreeHit() { return freeHit; }
    public void setFreeHit(boolean freeHit) { this.freeHit = freeHit; }
}
