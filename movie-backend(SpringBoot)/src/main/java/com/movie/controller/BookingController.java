package com.movie.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.movie.entity.Booking;
import com.movie.repository.BookingRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/bookings")
    public List<Booking> getUserBookings(Authentication authentication) {
        String username = authentication.getName();
        System.out.println("Logged in user: " + username);

        List<Booking> bookings = bookingRepository.findByUsername(username);
        System.out.println("Bookings found: " + bookings.size());

        return bookings;
    }
}