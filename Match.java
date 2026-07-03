package com.sameer.cricket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String team1;
    private String team2;
    private String format;
    private int overs;
    private String tossWinner;
    private String decision;
    private int score;
    private int wickets;
    private int balls;
    private int innings;
    private Integer target;
    private boolean completed;
    private Integer firstInningsScore;
    private String firstBattingTeam;
    private String secondBattingTeam;
    private String winner;
    private String result;
    private Long strikerBatsmanId;
    private Long nonStrikerBatsmanId;
    private Long currentBowlerId;
    private Long lastBowlerId;
    private boolean nextBallIsFreeHit;

    public Match() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTeam1() { return team1; }
    public void setTeam1(String team1) { this.team1 = team1; }

    public String getTeam2() { return team2; }
    public void setTeam2(String team2) { this.team2 = team2; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public int getOvers() { return overs; }
    public void setOvers(int overs) { this.overs = overs; }

    public String getTossWinner() { return tossWinner; }
    public void setTossWinner(String tossWinner) { this.tossWinner = tossWinner; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public int getBalls() { return balls; }
    public void setBalls(int balls) { this.balls = balls; }

    public int getInnings() { return innings; }
    public void setInnings(int innings) { this.innings = innings; }

    public Integer getTarget() { return target; }
    public void setTarget(Integer target) { this.target = target; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Integer getFirstInningsScore() { return firstInningsScore; }
    public void setFirstInningsScore(Integer firstInningsScore) { this.firstInningsScore = firstInningsScore; }

    public String getFirstBattingTeam() { return firstBattingTeam; }
    public void setFirstBattingTeam(String firstBattingTeam) { this.firstBattingTeam = firstBattingTeam; }

    public String getSecondBattingTeam() { return secondBattingTeam; }
    public void setSecondBattingTeam(String secondBattingTeam) { this.secondBattingTeam = secondBattingTeam; }

    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public Long getStrikerBatsmanId() { return strikerBatsmanId; }
    public void setStrikerBatsmanId(Long id) { this.strikerBatsmanId = id; }

    public Long getNonStrikerBatsmanId() { return nonStrikerBatsmanId; }
    public void setNonStrikerBatsmanId(Long id) { this.nonStrikerBatsmanId = id; }

    public Long getCurrentBowlerId() { return currentBowlerId; }
    public void setCurrentBowlerId(Long id) { this.currentBowlerId = id; }

    public Long getLastBowlerId() { return lastBowlerId; }
    public void setLastBowlerId(Long id) { this.lastBowlerId = id; }

    public boolean isNextBallIsFreeHit() { return nextBallIsFreeHit; }
    public void setNextBallIsFreeHit(boolean nextBallIsFreeHit) { this.nextBallIsFreeHit = nextBallIsFreeHit; }
}
