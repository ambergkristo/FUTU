package ee.futu.booking.domain.slot;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(
        name = "slot_template",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"weekday", "slot_index"})
        }
)
@Getter
@Setter
public class SlotTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 = E ... 7 = P
    @Column(nullable = false)
    private Short weekday;

    // 1..4
    @Column(name = "slot_index", nullable = false)
    private Short slotIndex;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer priceCents;

    @Column(nullable = false)
    private Boolean active = true;
}