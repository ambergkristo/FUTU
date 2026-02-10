package ee.futu.booking.domain.booking;

import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
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

    @Test
    void saveBookingWithNewModel() {
        Room room = new Room();
        room.setName("Party Room");
        room.setActive(true);
        room = roomRepository.save(room);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setBookingDate(LocalDate.now());
        booking.setStartTime(LocalTime.of(12, 0));
        booking.setEndTime(LocalTime.of(14, 0));
        booking.setStatus(BookingStatus.CREATED);
        booking.setTotalPriceCents(2500);

        Booking saved = bookingRepository.save(booking);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRoom().getId()).isEqualTo(room.getId());
        assertThat(saved.getStartTime()).isEqualTo(LocalTime.of(12, 0));
        assertThat(saved.getEndTime()).isEqualTo(LocalTime.of(14, 0));
    }
}
