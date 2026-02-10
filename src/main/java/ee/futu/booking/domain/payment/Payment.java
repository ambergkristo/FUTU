package ee.futu.booking.domain.payment;

import ee.futu.booking.domain.booking.Booking;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(length = 50)
    private String provider;

    @Column(length = 100)
    private String providerPaymentId;

    @Column(length = 20)
    private String status;

    private Integer amountCents;

    private LocalDateTime createdAt = LocalDateTime.now();
}