package ee.futu.booking.domain.booking;

import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.slot.SlotTemplate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "booking",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"room_id", "booking_date", "slot_template_id"})
        }
)
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

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_template_id", nullable = false)
    private SlotTemplate slotTemplate;

    @Column(nullable = false, length = 20)
    private String status;

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