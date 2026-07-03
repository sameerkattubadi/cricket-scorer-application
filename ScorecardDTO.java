package com.sameer.cricket.dto;



import java.util.List;

import com.sameer.cricket.entity.Ball;
import com.sameer.cricket.entity.Batsman;
import com.sameer.cricket.entity.Bowler;
import com.sameer.cricket.entity.Match;

public class ScorecardDTO {

    private Match match;

    private List<Batsman> batting;

    private List<Bowler> bowling;

    private List<Ball> balls;

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public List<Batsman> getBatting() {
        return batting;
    }

    public void setBatting(List<Batsman> batting) {
        this.batting = batting;
    }

    public List<Bowler> getBowling() {
        return bowling;
    }

    public void setBowling(List<Bowler> bowling) {
        this.bowling = bowling;
    }

    public List<Ball> getBalls() {
        return balls;
    }

    public void setBalls(List<Ball> balls) {
        this.balls = balls;
    }
}
