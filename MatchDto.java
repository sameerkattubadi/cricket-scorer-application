package com.sameer.cricket.dto;

public class MatchDto {
	 	private int id;
	    private String team1;
	    private String team2;
	    private String format;
	    private int score;
	    private int wickets;
	    private int balls;
	    private String battingTeam;
	    private String bowlingTeam;
	    private boolean completed;
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public String getTeam1() {
			return team1;
		}
		public void setTeam1(String team1) {
			this.team1 = team1;
		}
		public String getTeam2() {
			return team2;
		}
		public void setTeam2(String team2) {
			this.team2 = team2;
		}
		public String getFormat() {
			return format;
		}
		public void setFormat(String format) {
			this.format = format;
		}
		public int getScore() {
			return score;
		}
		public void setScore(int score) {
			this.score = score;
		}
		public int getWickets() {
			return wickets;
		}
		public void setWickets(int wickets) {
			this.wickets = wickets;
		}
		public int getBalls() {
			return balls;
		}
		public void setBalls(int balls) {
			this.balls = balls;
		}
		public String getBattingTeam() {
			return battingTeam;
		}
		public void setBattingTeam(String battingTeam) {
			this.battingTeam = battingTeam;
		}
		public String getBowlingTeam() {
			return bowlingTeam;
		}
		public void setBowlingTeam(String bowlingTeam) {
			this.bowlingTeam = bowlingTeam;
		}
		public boolean isCompleted() {
			return completed;
		}
		public void setCompleted(boolean completed) {
			this.completed = completed;
		}
	    
}
