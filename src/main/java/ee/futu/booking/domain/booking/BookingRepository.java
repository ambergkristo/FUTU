package ee.futu.booking.domain.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.bookingDate = :date AND b.status IN :statuses")
    List<Booking> findByRoomIdAndBookingDateAndStatusIn(@Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("statuses") List<BookingStatus> statuses);

    List<Booking> findByRoomIdAndBookingDateOrderByStartTime(Long roomId, LocalDate date);
}
