package com.movie.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.movie.entity.Movie;
import com.movie.service.MovieService;
import com.movie.service.BookingService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private BookingService bookingService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return movieService.getAllMovies();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public Movie updateMovie(@PathVariable int id, @RequestBody Movie updatedMovie) {
        Movie movie = movieService.getMovieById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setName(updatedMovie.getName());
        movie.setTheatre(updatedMovie.getTheatre());
        movie.setSeats(updatedMovie.getSeats());
        movie.setImageUrl(updatedMovie.getImageUrl());
        movie.setPrice(updatedMovie.getPrice());

        return movieService.saveMovie(movie);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public String deleteMovie(@PathVariable int id) {
        boolean deleted = movieService.deleteMovie(id);
        return deleted ? "Movie deleted successfully" : "Movie not found!";
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/book/{id}")
    public String bookTicket(
            @PathVariable int id,
            @RequestBody List<String> selectedSeats,
            Authentication authentication) {
            
        String username = authentication.getName();
        return bookingService.bookTicket(id, selectedSeats, username);
    }
}