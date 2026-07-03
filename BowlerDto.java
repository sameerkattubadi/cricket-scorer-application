package com.sameer.cricket.dto;

public class BowlerDto {
    private int id;
    private String name;
    private String team;
    private int runs;
    private int wickets;
    private int overs;
    private int balls;
    private int maidens;
    private double economy;

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public int getOvers() { return overs; }
    public void setOvers(int overs) { this.overs = overs; }

    public int getBalls() { return balls; }
    public void setBalls(int balls) { this.balls = balls; }

    public int getMaidens() { return maidens; }
    public void setMaidens(int maidens) { this.maidens = maidens; }

    public double getEconomy() { return economy; }
    public void setEconomy(double economy) { this.economy = economy; }
}
