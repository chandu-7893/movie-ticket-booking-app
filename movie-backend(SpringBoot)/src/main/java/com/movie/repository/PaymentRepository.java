package com.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

}
