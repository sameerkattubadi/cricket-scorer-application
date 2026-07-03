package com.sameer.cricket.dto;

public class BatsmanDto {
    private int id;
    private String name;
    private String team;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private boolean out;
    private double average;
    private double strikeRate;

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getBalls() { return balls; }
    public void setBalls(int balls) { this.balls = balls; }

    public int getFours() { return fours; }
    public void setFours(int fours) { this.fours = fours; }

    public int getSixes() { return sixes; }
    public void setSixes(int sixes) { this.sixes = sixes; }

    public boolean isOut() { return out; }
    public void setOut(boolean out) { this.out = out; }

    public double getAverage() { return average; }
    public void setAverage(double average) { this.average = average; }

    public double getStrikeRate() { return strikeRate; }
    public void setStrikeRate(double strikeRate) { this.strikeRate = strikeRate; }
}
