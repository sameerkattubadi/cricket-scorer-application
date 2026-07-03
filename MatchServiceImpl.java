package com.sameer.cricket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sameer.cricket.dto.BallDTO;
import com.sameer.cricket.dto.ScorecardDTO;
import com.sameer.cricket.entity.Ball;
import com.sameer.cricket.entity.Batsman;
import com.sameer.cricket.entity.Bowler;
import com.sameer.cricket.entity.Match;
import com.sameer.cricket.repository.BallRepository;
import com.sameer.cricket.repository.BatsmanRepository;
import com.sameer.cricket.repository.BowlerRepository;
import com.sameer.cricket.repository.MatchRepository;

@Service
public class MatchServiceImpl implements MatchService {

    @Autowired
    private MatchRepository repository;

    @Autowired
    private BallRepository ballRepository;

    @Autowired
    private BatsmanRepository batsmanRepository;

    @Autowired
    private BowlerRepository bowlerRepository;

    @Override
    public Match createMatch(Match match) {
        return repository.save(match);
    }

    @Override
    public List<Match> getAllMatches() {
        return repository.findAll();
    }

    @Override
    public Match getMatch(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void deleteMatch(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Match addBall(Long matchId, BallDTO dto) {
        Match match = repository.findById(matchId).orElseThrow();

        if (match.isCompleted()) {
            throw new RuntimeException("Match already completed");
        }

        if (match.getStrikerBatsmanId() == null || match.getNonStrikerBatsmanId() == null) {
            throw new RuntimeException("Active batsmen not set");
        }

        if (match.getCurrentBowlerId() == null) {
            throw new RuntimeException("Current bowler not set");
        }

        Batsman striker = batsmanRepository.findById(match.getStrikerBatsmanId())
                .orElseThrow(() -> new RuntimeException("Striker not found"));
        Batsman nonStriker = batsmanRepository.findById(match.getNonStrikerBatsmanId())
                .orElseThrow(() -> new RuntimeException("Non-striker not found"));
        Bowler bowler = bowlerRepository.findById(match.getCurrentBowlerId())
                .orElseThrow(() -> new RuntimeException("Bowler not found"));

        boolean isNoBall = "NO_BALL".equals(dto.getExtraType());
        boolean isFreeHit = match.isNextBallIsFreeHit();

        // Create and save ball record
        Ball ball = new Ball();
        ball.setMatchId(matchId);
        ball.setRuns(dto.getRuns());
        ball.setWicket(dto.isWicket());
        ball.setExtraType(dto.getExtraType());
        ball.setFreeHit(isFreeHit);
        ball.setOverNumber((match.getBalls() / 6) + 1);
        ball.setBallNumber((match.getBalls() % 6) + 1);
        
        // For No Balls: separate batsman runs from total
        // Total runs = no ball (1) + batsman runs
        if (isNoBall) {
            ball.setBatsmanRuns(dto.getRuns() - 1); // Subtract the no ball itself
        } else {
            ball.setBatsmanRuns(dto.getRuns());
        }
        
        ballRepository.save(ball);

        // Update match score
        match.setScore(match.getScore() + dto.getRuns());

        // Handle wicket - with dismissal mode logic
        boolean batsmanOut = false;
        if (dto.isWicket()) {
            if (isNoBall || isFreeHit) {
                // Only RUN_OUT is allowed on a No Ball or Free Hit
                batsmanOut = "RUN_OUT".equals(dto.getDismissalMode());
            } else {
                batsmanOut = true;
            }
        }

        if (batsmanOut) {
            match.setWickets(match.getWickets() + 1);
            striker.setOutStatus(true);
            batsmanRepository.save(striker);
            match.setStrikerBatsmanId(null);
        }

        // Handle bowler wicket - with dismissal mode logic
        boolean bowlerGetsWicket = false;
        if (dto.isWicket()) {
            if (!isNoBall && !isFreeHit) {
                bowlerGetsWicket = !"RUN_OUT".equals(dto.getDismissalMode());
            }
        }

        if (bowlerGetsWicket) {
            bowler.setWickets(bowler.getWickets() + 1);
        }

        // Update bowler stats (only legal deliveries count for overs)
        if (!"WIDE".equals(dto.getExtraType()) && !"NO_BALL".equals(dto.getExtraType())) {
            bowler.setRuns(bowler.getRuns() + dto.getRuns());
            int totalBallsBowled = (bowler.getOvers() * 6) + bowler.getBallsBowled() + 1;
            bowler.setOvers(totalBallsBowled / 6);
            bowler.setBallsBowled(totalBallsBowled % 6);
        } else {
            // Wides and No Balls do count as runs conceded
            bowler.setRuns(bowler.getRuns() + dto.getRuns());
        }

        bowlerRepository.save(bowler);

        // Update striker stats
        if (!batsmanOut) {
            if (!"WIDE".equals(dto.getExtraType()) && !"NO_BALL".equals(dto.getExtraType())) {
                striker.setBalls(striker.getBalls() + 1);
            }
            striker.setRuns(striker.getRuns() + dto.getRuns());

            // Count fours and sixes
            if (dto.getRuns() == 4) {
                striker.setFours(striker.getFours() + 1);
            } else if (dto.getRuns() == 6) {
                striker.setSixes(striker.getSixes() + 1);
            }
        }
        batsmanRepository.save(striker);

        // Update non-striker stats
        if (!"WIDE".equals(dto.getExtraType()) && !"NO_BALL".equals(dto.getExtraType())) {
            nonStriker.setBalls(nonStriker.getBalls() + 1);
        }
        nonStriker.setRuns(nonStriker.getRuns() + dto.getRuns());
        if (dto.getRuns() == 4) {
            nonStriker.setFours(nonStriker.getFours() + 1);
        } else if (dto.getRuns() == 6) {
            nonStriker.setSixes(nonStriker.getSixes() + 1);
        }
        batsmanRepository.save(nonStriker);

        // Free hit lifecycle
        if (isFreeHit) {
            match.setNextBallIsFreeHit(false);
        }
        if (isNoBall) {
            match.setNextBallIsFreeHit(true);
        }

        // Count legal balls only (not wides or no balls)
        if (!"WIDE".equals(dto.getExtraType()) && !"NO_BALL".equals(dto.getExtraType())) {
            match.setBalls(match.getBalls() + 1);

            // Strike rotation - odd runs or end of over
            if ((dto.getRuns() % 2 == 1) && !batsmanOut) {
                // Swap striker and non-striker
                Long temp = match.getStrikerBatsmanId();
                match.setStrikerBatsmanId(match.getNonStrikerBatsmanId());
                match.setNonStrikerBatsmanId(temp);
            }

            // Check end of over
            if (match.getBalls() % 6 == 0) {
                match.setLastBowlerId(match.getCurrentBowlerId());
                match.setCurrentBowlerId(null);

                // Rotate strike at end of over
                Long temp = match.getStrikerBatsmanId();
                match.setStrikerBatsmanId(match.getNonStrikerBatsmanId());
                match.setNonStrikerBatsmanId(temp);
            }
        }

        int totalBalls = match.getOvers() * 6;

        // === FIRST INNINGS COMPLETE ===
        if (match.getInnings() == 1) {
            if (match.getBalls() >= totalBalls || match.getWickets() >= 10) {

                // Save first innings score
                match.setFirstInningsScore(match.getScore());

                // Determine batting teams
                if ("BAT".equalsIgnoreCase(match.getDecision())) {
                    match.setFirstBattingTeam(match.getTossWinner());
                    if (match.getTossWinner().equals(match.getTeam1())) {
                        match.setSecondBattingTeam(match.getTeam2());
                    } else {
                        match.setSecondBattingTeam(match.getTeam1());
                    }
                } else {
                    if (match.getTossWinner().equals(match.getTeam1())) {
                        match.setFirstBattingTeam(match.getTeam2());
                        match.setSecondBattingTeam(match.getTeam1());
                    } else {
                        match.setFirstBattingTeam(match.getTeam1());
                        match.setSecondBattingTeam(match.getTeam2());
                    }
                }

                // Set target for second innings
                match.setTarget(match.getScore() + 1);

                // Reset for second innings
                match.setInnings(2);
                match.setScore(0);
                match.setWickets(0);
                match.setBalls(0);
                match.setStrikerBatsmanId(null);
                match.setNonStrikerBatsmanId(null);
                match.setCurrentBowlerId(null);
                match.setLastBowlerId(null);
                match.setNextBallIsFreeHit(false);
            }
        }

        // === SECOND INNINGS COMPLETE ===
        else if (match.getInnings() == 2) {

            // Chasing team wins
            if (match.getScore() > match.getTarget()) {
                match.setCompleted(true);
                match.setWinner(match.getSecondBattingTeam());
                int wicketsRemaining = 10 - match.getWickets();
                match.setResult("Won by " + wicketsRemaining + " wickets");
            }
            //drawn
            else if (match.getScore() == match.getTarget()-1&&(match.getBalls() >= totalBalls || match.getWickets() >= 10)) {
                match.setCompleted(true);
                match.setWinner(null);
//                int wicketsRemaining = 10 - match.getWickets();
                match.setResult("Match drawn");
            }

            // Overs completed or all out - first innings team wins
            else if (match.getBalls() >= totalBalls || match.getWickets() >= 10) {
                match.setCompleted(true);
                match.setWinner(match.getFirstBattingTeam());
                int runsMargin = match.getTarget() - match.getScore() - 1;
                match.setResult("Won by " + runsMargin + " runs");
            }
        }

        repository.save(match);
        return match;
    }

    @Override
    public List<Ball> getBalls(Long matchId) {
        return ballRepository.findByMatchId(matchId);
    }

    @Override
    public ScorecardDTO getFullScorecard(Long matchId) {
        ScorecardDTO dto = new ScorecardDTO();

        dto.setMatch(repository.findById(matchId).orElse(null));

        dto.setBatting(batsmanRepository.findByMatchId(matchId));

        dto.setBowling(bowlerRepository.findByMatchId(matchId));

        dto.setBalls(ballRepository.findByMatchId(matchId));

        return dto;
    }
}
