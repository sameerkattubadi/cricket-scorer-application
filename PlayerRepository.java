package com.sameer.cricket.repository;

import com.sameer.cricket.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository
        extends JpaRepository<Player, Long> {

    List<Player> findByMatchId(Long matchId);

    List<Player> findByMatchIdAndTeamName(
        Long matchId, String teamName);
}