package ee.futu.booking.domain.booking;

import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import ee.futu.booking.domain.slot.SlotTemplate;
import ee.futu.booking.domain.slot.SlotTemplateRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SlotTemplateRepository slotTemplateRepository;

    @Test
    void saveBookingWithRelations() {
        Room room = new Room();
        room.setName("Party Room");
        room.setActive(true);
        room = roomRepository.save(room);

        SlotTemplate slot = new SlotTemplate();
        slot.setWeekday((short) 5);
        slot.setSlotIndex((short) 1);
        slot.setStartTime(LocalTime.of(12, 0));
        slot.setEndTime(LocalTime.of(14, 0));
        slot.setPriceCents(2500);
        slot.setActive(true);
        slot = slotTemplateRepository.save(slot);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setSlotTemplate(slot);
        booking.setBookingDate(LocalDate.now());
        booking.setStatus("CREATED");
        booking.setTotalPriceCents(2500);

        Booking saved = bookingRepository.save(booking);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRoom().getId()).isEqualTo(room.getId());
    }
}
