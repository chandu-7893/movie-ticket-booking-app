package com.movie.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String username;
	    private String movieName;
	    private String theatre;
	    private int amount;

	    private String cardName;
	    private String cardNumber;
	    private String expiry;
		public Payment(Long id, String username, String movieName, String theatre, int amount, String cardName,
				String cardNumber, String expiry) {
			super();
			this.id = id;
			this.username = username;
			this.movieName = movieName;
			this.theatre = theatre;
			this.amount = amount;
			this.cardName = cardName;
			this.cardNumber = cardNumber;
			this.expiry = expiry;
		}
		public Long getId() {
			return id;
		}
		public String getUsername() {
			return username;
		}
		public String getMovieName() {
			return movieName;
		}
		public String getTheatre() {
			return theatre;
		}
		public int getAmount() {
			return amount;
		}
		public String getCardName() {
			return cardName;
		}
		public String getCardNumber() {
			return cardNumber;
		}
		public String getExpiry() {
			return expiry;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public void setUsername(String username) {
			this.username = username;
		}
		public void setMovieName(String movieName) {
			this.movieName = movieName;
		}
		public void setTheatre(String theatre) {
			this.theatre = theatre;
		}
		public void setAmount(int amount) {
			this.amount = amount;
		}
		public void setCardName(String cardName) {
			this.cardName = cardName;
		}
		public void setCardNumber(String cardNumber) {
			this.cardNumber = cardNumber;
		}
		public void setExpiry(String expiry) {
			this.expiry = expiry;
		}
		
}
