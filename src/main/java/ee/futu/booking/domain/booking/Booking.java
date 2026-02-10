package ee.futu.booking.domain.booking;

import ee.futu.booking.domain.room.Room;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "booking", uniqueConstraints = {
                @UniqueConstraint(columnNames = { "room_id", "booking_date", "start_time" })
})
@Getter
@Setter
public class Booking {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(optional = false)
        @JoinColumn(name = "room_id", nullable = false)
        private Room room;

        @Column(name = "booking_date", nullable = false)
        private LocalDate bookingDate;

        @Column(name = "start_time", nullable = false)
        private LocalTime startTime;

        @Column(name = "end_time", nullable = false)
        private LocalTime endTime;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private BookingStatus status;

        @Column(length = 100)
        private String customerName;

        @Column(length = 100)
        private String customerEmail;

        @Column(length = 50)
        private String customerPhone;

        @Column(nullable = false)
        private Integer totalPriceCents;

        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        @Version
        private Integer version;
}
