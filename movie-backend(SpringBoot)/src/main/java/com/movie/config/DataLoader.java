package com.movie.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.movie.entity.User;
import com.movie.repository.UserRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User("admin", passwordEncoder.encode("1234"), "ADMIN");
                userRepository.save(admin);
            }
        };
    }
}