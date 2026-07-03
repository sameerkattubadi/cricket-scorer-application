package com.sameer.cricket.dto;

public class BallDTO {
    private int runs;
    private boolean wicket;
    private String extraType;
    private String dismissalMode;

    public BallDTO() {
    }

    public int getRuns() {
        return runs;
    }

    public void setRuns(int runs) {
        this.runs = runs;
    }

    public boolean isWicket() {
        return wicket;
    }

    public void setWicket(boolean wicket) {
        this.wicket = wicket;
    }

    public String getExtraType() {
        return extraType;
    }

    public void setExtraType(String extraType) {
        this.extraType = extraType;
    }

    public String getDismissalMode() {
        return dismissalMode;
    }

    public void setDismissalMode(String dismissalMode) {
        this.dismissalMode = dismissalMode;
    }
}
