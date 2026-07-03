package com.sameer.cricket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sameer.cricket.entity.Ball;

public interface BallRepository extends JpaRepository<Ball, Long> {

List<Ball> findByMatchId(Long matchId);
}
