package com.sameer.cricket.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sameer.cricket.dto.BallDTO;
import com.sameer.cricket.dto.ScorecardDTO;
import com.sameer.cricket.entity.Ball;
import com.sameer.cricket.entity.Batsman;
import com.sameer.cricket.entity.Bowler;
import com.sameer.cricket.entity.Match;
import com.sameer.cricket.entity.Player;
import com.sameer.cricket.entity.User;
import com.sameer.cricket.service.MatchService;
import com.sameer.cricket.repository.BatsmanRepository;
import com.sameer.cricket.repository.BowlerRepository;
import com.sameer.cricket.repository.MatchRepository;
import com.sameer.cricket.repository.PlayerRepository;
import com.sameer.cricket.util.TokenHelper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchService service;

    @Autowired
    private BatsmanRepository batsmanRepository;

    @Autowired
    private BowlerRepository bowlerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TokenHelper tokenHelper;

    private User getUser(HttpServletRequest req) {
        return tokenHelper.getUserFromRequest(req);
    }

    private Match getOwnedMatch(Long matchId, Long userId) {
        return matchRepository
            .findByIdAndUserId(matchId, userId)
            .orElseThrow(() ->
                new RuntimeException("Match not found"));
    }

    @PostMapping
    public ResponseEntity<?> createMatch(
            @RequestBody Match match,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            match.setUserId(user.getId());
            return ResponseEntity.ok(
                service.createMatch(match));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllMatches(
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            return ResponseEntity.ok(
                matchRepository.findByUserId(user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMatch(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            return ResponseEntity.ok(
                getOwnedMatch(id, user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            service.deleteMatch(id);
            return ResponseEntity.ok(
                Map.of("message", "Deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/ball")
    public ResponseEntity<?> addBall(
            @PathVariable Long id,
            @RequestBody BallDTO dto,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            Match match = service.addBall(id, dto);
            return ResponseEntity.ok(match);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<?> getScorecard(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            return ResponseEntity.ok(
                getOwnedMatch(id, user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/players")
    public ResponseEntity<?> addPlayer(
            @PathVariable Long id,
            @RequestBody Player player,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            player.setMatchId(id);
            return ResponseEntity.ok(
                playerRepository.save(player));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/players")
    public ResponseEntity<?> getPlayers(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                playerRepository.findByMatchId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/players/{teamName}")
    public ResponseEntity<?> getPlayersByTeam(
            @PathVariable Long id,
            @PathVariable String teamName,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                playerRepository
                    .findByMatchIdAndTeamName(id, teamName));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/batsman")
    public ResponseEntity<?> addBatsman(
            @PathVariable Long id,
            @RequestBody Batsman batsman,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            Match match = getOwnedMatch(id, user.getId());
            int currentInnings = match.getInnings();

            List<Batsman> current =
                batsmanRepository
                    .findByMatchIdAndInnings(id, currentInnings);

            long active = current.stream()
                .filter(b -> !b.isOutStatus())
                .count();

            if (active >= 2) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message",
                        "Already 2 batsmen on the crease"));
            }

            String battingTeam = "";
            if (currentInnings == 1) {
                if ("BAT".equalsIgnoreCase(match.getDecision())) {
                    battingTeam = match.getTossWinner();
                } else {
                    battingTeam = match.getTossWinner().equals(match.getTeam1())
                        ? match.getTeam2() : match.getTeam1();
                }
            } else {
                battingTeam = match.getSecondBattingTeam();
            }

            batsman.setMatchId(id);
            batsman.setInnings(currentInnings);
            batsman.setTeamName(battingTeam);
            Batsman saved = batsmanRepository.save(batsman);

            if (match.getStrikerBatsmanId() == null) {
                match.setStrikerBatsmanId(saved.getId());
            } else if (match.getNonStrikerBatsmanId() == null) {
                match.setNonStrikerBatsmanId(saved.getId());
            }
            service.createMatch(match);

            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/batting")
    public ResponseEntity<?> getBatting(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            Match match = getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                batsmanRepository
                    .findByMatchIdAndInnings(id, match.getInnings()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/bowler")
    public ResponseEntity<?> addBowler(
            @PathVariable Long id,
            @RequestBody Bowler bowler,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            Match match = getOwnedMatch(id, user.getId());
            int currentInnings = match.getInnings();
            String newName = bowler.getPlayerName().trim();

            if (match.getLastBowlerId() != null) {
                Bowler last = bowlerRepository
                    .findById(match.getLastBowlerId())
                    .orElse(null);
                if (last != null
                        && last.getPlayerName()
                            .equalsIgnoreCase(newName)) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("message",
                            newName + " cannot bowl consecutive overs"));
                }
            }

            int maxOvers = getMaxOvers(match.getFormat(), match.getOvers());

            List<Bowler> currentBowlers =
                bowlerRepository
                    .findByMatchIdAndInnings(id, currentInnings);

            Bowler existing = null;
            for (Bowler b : currentBowlers) {
                if (b.getPlayerName().equalsIgnoreCase(newName)) {
                    existing = b;
                    break;
                }
            }

            String bowlingTeam = "";
            if (currentInnings == 1) {
                if ("BAT".equalsIgnoreCase(match.getDecision())) {
                    bowlingTeam = match.getTossWinner().equals(match.getTeam1())
                        ? match.getTeam2() : match.getTeam1();
                } else {
                    bowlingTeam = match.getTossWinner();
                }
            } else {
                bowlingTeam = match.getFirstBattingTeam();
            }

            if (existing != null) {
                if (existing.getOvers() >= maxOvers) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("message",
                            newName + " has reached max " + maxOvers + " overs"));
                }
                match.setCurrentBowlerId(existing.getId());
                service.createMatch(match);
                return ResponseEntity.ok(existing);
            }

            bowler.setMatchId(id);
            bowler.setPlayerName(newName);
            bowler.setInnings(currentInnings);
            bowler.setTeamName(bowlingTeam);
            Bowler saved = bowlerRepository.save(bowler);

            match.setCurrentBowlerId(saved.getId());
            service.createMatch(match);
            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/bowling")
    public ResponseEntity<?> getBowling(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            Match match = getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                bowlerRepository
                    .findByMatchIdAndInnings(id, match.getInnings()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/full-scorecard")
    public ResponseEntity<?> getFullScorecard(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                service.getFullScorecard(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/balls")
    public ResponseEntity<?> getBalls(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            User user = getUser(request);
            getOwnedMatch(id, user.getId());
            return ResponseEntity.ok(
                service.getBalls(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", e.getMessage()));
        }
    }

    private int getMaxOvers(String format, int totalOvers) {
        if ("TEST".equalsIgnoreCase(format)) {
            return Integer.MAX_VALUE;
        }
        return totalOvers / 5;
    }
}
