package com.sameer.cricket.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sameer.cricket.entity.Batsman;

public interface BatsmanRepository
        extends JpaRepository<Batsman, Long> {

    List<Batsman> findByMatchId(Long matchId);

    List<Batsman> findByMatchIdAndInnings(
        Long matchId, int innings);
}