package com.movie.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.movie.entity.Booking;
import com.movie.entity.Movie;
import com.movie.repository.BookingRepository;
import com.movie.repository.MovieRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    // ===========================
    // GET USER BOOKINGS
    // ===========================
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/bookings")
    public List<Booking> getUserBookings(Authentication authentication) {
        String username = authentication.getName();
        return bookingRepository.findByUsername(username);
    }

    // ===========================
    // LOCK SEATS (USER)
    // ===========================
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/lock/{movieId}")
    public ResponseEntity<?> lockSeats(
            @PathVariable Integer movieId,
            @RequestBody List<String> seats) {

        Movie movie = movieRepository.findById(movieId).orElseThrow();

        List<String> lockedList = movie.getLockedSeats() == null || movie.getLockedSeats().isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(Arrays.asList(movie.getLockedSeats().split(",")));

        for (String seat : seats) {
            if (!lockedList.contains(seat)) {
                lockedList.add(seat);
            }
        }

        movie.setLockedSeats(String.join(",", lockedList));
        movieRepository.save(movie);

        return ResponseEntity.ok("Seats locked");
    }

    // ===========================
    // UNLOCK SEATS (USER)
    // ===========================
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/unlock/{movieId}")
    public ResponseEntity<?> unlockSeats(
            @PathVariable Integer movieId,
            @RequestBody List<String> seats) {

        Movie movie = movieRepository.findById(movieId).orElseThrow();

        List<String> lockedList = movie.getLockedSeats() == null || movie.getLockedSeats().isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(Arrays.asList(movie.getLockedSeats().split(",")));

        lockedList.removeAll(seats);

        movie.setLockedSeats(String.join(",", lockedList));
        movieRepository.save(movie);

        return ResponseEntity.ok("Seats unlocked");
    }

    // ===========================
    // ADMIN UNLOCK LOCKED SEATS
    // ===========================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/unlock/{movieId}")
    public ResponseEntity<?> adminUnlockSeats(
            @PathVariable Integer movieId,
            @RequestBody List<String> seats) {

        Movie movie = movieRepository.findById(movieId).orElseThrow();

        List<String> lockedList = movie.getLockedSeats() == null || movie.getLockedSeats().isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(Arrays.asList(movie.getLockedSeats().split(",")));

        lockedList.removeAll(seats);

        movie.setLockedSeats(String.join(",", lockedList));
        movieRepository.save(movie);

        return ResponseEntity.ok("Selected seats unlocked by admin");
    }

    // ===========================
    // ADMIN REMOVE BOOKED SEATS ✅ FIXED
    // ===========================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/remove-booked/{movieId}")
    public ResponseEntity<String> removeBookedSeat(
            @PathVariable Integer movieId,
            @RequestBody List<String> seats) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        List<String> bookedList = movie.getBookedSeats() == null || movie.getBookedSeats().isBlank()
                ? new ArrayList<>()
                : new ArrayList<>(Arrays.asList(movie.getBookedSeats().split(",")));

        bookedList.removeAll(seats);

        movie.setBookedSeats(String.join(",", bookedList));
        movieRepository.save(movie);

        return ResponseEntity.ok("Booked seat removed successfully");
    }
}