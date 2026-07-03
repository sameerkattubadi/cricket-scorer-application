package com.sameer.cricket.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sameer.cricket.entity.Bowler;

public interface BowlerRepository
        extends JpaRepository<Bowler, Long> {

    List<Bowler> findByMatchId(Long matchId);

    List<Bowler> findByMatchIdAndInnings(
        Long matchId, int innings);
}