package com.sameer.cricket.service;

import java.util.List;

import com.sameer.cricket.dto.BallDTO;
import com.sameer.cricket.dto.ScorecardDTO;
import com.sameer.cricket.entity.Ball;
import com.sameer.cricket.entity.Match;

public interface MatchService {

    Match createMatch(Match match);

    List<Match> getAllMatches();

    Match getMatch(Long id);

    List<Ball> getBalls(Long matchId);

    void deleteMatch(Long id);

    Match addBall(Long matchId, BallDTO dto);

    ScorecardDTO getFullScorecard(Long matchId);
}
