package ee.futu.booking.domain.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.bookingDate = :date AND b.status IN :statuses")
    List<Booking> findByRoomIdAndBookingDateAndStatusIn(@Param("roomId") Long roomId,
            @Param("date") java.time.LocalDate date,
            @Param("statuses") List<BookingStatus> statuses);

    List<Booking> findByRoomIdAndBookingDateOrderByStartTime(Long roomId, java.time.LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.bookingDate = :date AND " +
            "(b.status = :confirmedStatus OR (b.status = :draftStatus AND b.expiresAt > :now))")
    List<Booking> findActiveBookings(@Param("roomId") Long roomId,
            @Param("date") java.time.LocalDate date,
            @Param("confirmedStatus") BookingStatus confirmedStatus,
            @Param("draftStatus") BookingStatus draftStatus,
            @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status = :draftStatus AND b.expiresAt <= :now")
    List<Booking> findExpiredDrafts(@Param("draftStatus") BookingStatus draftStatus,
            @Param("now") LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE Booking b SET b.status = :cancelledStatus WHERE b.id IN :ids")
    int updateStatusByIds(@Param("ids") List<Long> ids,
            @Param("cancelledStatus") BookingStatus cancelledStatus);
}
