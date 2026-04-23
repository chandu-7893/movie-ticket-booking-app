package com.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Integer> {

}
