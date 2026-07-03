package com.sameer.cricket.repository;

import com.sameer.cricket.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository
        extends JpaRepository<Match, Long> {

    List<Match> findByUserId(Long userId);

    Optional<Match> findByIdAndUserId(
        Long id, Long userId);
}