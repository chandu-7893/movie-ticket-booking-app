package com.movie.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.movie.entity.Movie;
import com.movie.entity.Booking;
import com.movie.repository.MovieRepository;
import com.movie.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public String bookTicket(int id, List<String> selectedSeats, String username) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);

        if (optionalMovie.isEmpty()) {
            return "Movie not found!";
        }

        Movie movie = optionalMovie.get();

        String existing = movie.getBookedSeats();
        Set<String> bookedSet = new HashSet<>();

        if (existing != null && !existing.isEmpty()) {
            bookedSet.addAll(Arrays.asList(existing.split(",")));
        }

        for (String seat : selectedSeats) {
            if (bookedSet.contains(seat)) {
                return "Seat " + seat + " is already booked!";
            }
        }

        if (movie.getSeats() < selectedSeats.size()) {
            return "Not enough seats available!";
        }

        bookedSet.addAll(selectedSeats);

        movie.setBookedSeats(String.join(",", bookedSet));
        movie.setSeats(movie.getSeats() - selectedSeats.size());

        movieRepository.save(movie);

        Booking booking = new Booking();
        booking.setUsername(username);
        booking.setMovieName(movie.getName());
        booking.setTheatre(movie.getTheatre());
        booking.setSeats(selectedSeats);
        booking.setTotalPrice(movie.getPrice() * selectedSeats.size());

        bookingRepository.save(booking);

        return "Booked seats: " + String.join(", ", selectedSeats);
    }

    public List<Booking> getBookingsByUsername(String username) {
        return bookingRepository.findByUsername(username);
    }
}