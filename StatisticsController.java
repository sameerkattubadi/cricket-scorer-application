package com.sameer.cricket.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sameer.cricket.dto.BatsmanDto;
import com.sameer.cricket.dto.BowlerDto;
import com.sameer.cricket.entity.Batsman;
import com.sameer.cricket.entity.Bowler;
import com.sameer.cricket.entity.Match;
import com.sameer.cricket.entity.User;
import com.sameer.cricket.repository.BatsmanRepository;
import com.sameer.cricket.repository.BowlerRepository;
import com.sameer.cricket.repository.MatchRepository;
import com.sameer.cricket.util.TokenHelper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private BatsmanRepository batsmanRepository;

    @Autowired
    private BowlerRepository bowlerRepository;

    @Autowired
    private TokenHelper tokenHelper;

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpServletRequest request) {
        try {
            User user = tokenHelper.getUserFromRequest(request);
            List<Match> matches = matchRepository.findByUserId(user.getId());

            int totalMatches = matches.size();
            int highestScore = matches.stream().mapToInt(Match::getScore).max().orElse(0);
            double averageScore = matches.stream().mapToInt(Match::getScore).average().orElse(0);
            long completedMatches = matches.stream().filter(Match::isCompleted).count();
            int totalRuns = matches.stream().mapToInt(Match::getScore).sum();
            int totalWickets = matches.stream().mapToInt(Match::getWickets).sum();

            Map<String, Object> response = new HashMap<>();
            response.put("totalMatches", totalMatches);
            response.put("highestScore", highestScore);
            response.put("averageScore", Math.round(averageScore * 10.0) / 10.0);
            response.put("completedMatches", completedMatches);
            response.put("totalRuns", totalRuns);
            response.put("totalWickets", totalWickets);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/batting")
    public ResponseEntity<?> battingStats(HttpServletRequest request) {
        try {
            User user = tokenHelper.getUserFromRequest(request);
            List<Match> userMatches = matchRepository.findByUserId(user.getId());
            List<Long> matchIds = userMatches.stream().map(Match::getId).collect(Collectors.toList());

            List<Batsman> allBatsmen = batsmanRepository.findAll()
                .stream()
                .filter(b -> matchIds.contains(b.getMatchId()))
                .collect(Collectors.toList());

            Map<String, BatsmanDto> stats = new HashMap<>();

            for (Batsman b : allBatsmen) {
                String key = b.getPlayerName() + "_" + (b.getTeamName() != null ? b.getTeamName() : "Unknown");
                stats.putIfAbsent(key, new BatsmanDto());

                BatsmanDto stat = stats.get(key);
                stat.setName(b.getPlayerName());
                stat.setTeam(b.getTeamName() != null ? b.getTeamName() : "Unknown");
                stat.setRuns(stat.getRuns() + b.getRuns());
                stat.setBalls(stat.getBalls() + b.getBalls());
                stat.setFours(stat.getFours() + b.getFours());
                stat.setSixes(stat.getSixes() + b.getSixes());
            }

            List<BatsmanDto> sortedStats = stats.values().stream()
                .peek(s -> {
                    if (s.getRuns() > 0) {
                        s.setAverage((double) s.getRuns() / Math.max(1, (int) allBatsmen.stream()
                            .filter(b -> b.getPlayerName().equals(s.getName()))
                            .filter(b -> b.isOutStatus())
                            .count()));
                    }
                    if (s.getBalls() > 0) {
                        s.setStrikeRate((double) s.getRuns() * 100 / s.getBalls());
                    }
                })
                .sorted((a, b) -> Integer.compare(b.getRuns(), a.getRuns()))
                .collect(Collectors.toList());

            return ResponseEntity.ok(sortedStats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/bowling")
    public ResponseEntity<?> bowlingStats(HttpServletRequest request) {
        try {
            User user = tokenHelper.getUserFromRequest(request);
            List<Match> userMatches = matchRepository.findByUserId(user.getId());
            List<Long> matchIds = userMatches.stream().map(Match::getId).collect(Collectors.toList());

            List<Bowler> allBowlers = bowlerRepository.findAll()
                .stream()
                .filter(b -> matchIds.contains(b.getMatchId()))
                .collect(Collectors.toList());

            Map<String, BowlerDto> stats = new HashMap<>();

            for (Bowler b : allBowlers) {
                String key = b.getPlayerName() + "_" + (b.getTeamName() != null ? b.getTeamName() : "Unknown");
                stats.putIfAbsent(key, new BowlerDto());

                BowlerDto stat = stats.get(key);
                stat.setName(b.getPlayerName());
                stat.setTeam(b.getTeamName() != null ? b.getTeamName() : "Unknown");
                stat.setRuns(stat.getRuns() + b.getRuns());
                stat.setWickets(stat.getWickets() + b.getWickets());
                stat.setBalls(stat.getBalls() + (b.getOvers() * 6) + b.getBallsBowled());
            }

            List<BowlerDto> sortedStats = stats.values().stream()
                .peek(s -> {
                    int totalBalls = s.getBalls();
                    int overs = totalBalls / 6;
                    int balls = totalBalls % 6;
                    s.setOvers(overs);
                    s.setBalls(balls);
                    if (totalBalls > 0) {
                        s.setEconomy((double) s.getRuns() * 6 / totalBalls);
                    }
                })
                .sorted((a, b) -> Integer.compare(b.getWickets(), a.getWickets()))
                .collect(Collectors.toList());

            return ResponseEntity.ok(sortedStats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
