package com.sameer.cricket.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sameer.cricket.entity.Match;
import com.sameer.cricket.repository.MatchRepository;

@Repository
public class MatchDao {
	@Autowired
    private MatchRepository repository;

    public Match saveMatch(Match match) {
        return repository.save(match);
    }

    public List<Match> getAllMatches() {
        return repository.findAll();
    }

    public Match getMatchById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteMatch(Long id) {
        repository.deleteById(id);
    }
}
