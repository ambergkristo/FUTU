package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingExpirationScheduler {

    private final BookingRepository bookingRepository;

    public BookingExpirationScheduler(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedDelay = 60000) // Every minute
    public void cancelExpiredDrafts() {
        List<Booking> expiredDrafts = bookingRepository.findExpiredDrafts(BookingStatus.DRAFT, LocalDateTime.now());

        if (!expiredDrafts.isEmpty()) {
            List<Long> expiredIds = expiredDrafts.stream()
                    .map(Booking::getId)
                    .toList();
            bookingRepository.updateStatusByIds(expiredIds, BookingStatus.CANCELLED);
        }
    }

    @Scheduled(fixedDelay = 60000) // Every minute
    public void cancelExpiredTemporaryBookings() {
        List<BookingStatus> temporaryStatuses = List.of(BookingStatus.DRAFT, BookingStatus.PENDING_PAYMENT);
        List<Booking> expiredBookings = bookingRepository.findExpiredTemporaryBookings(temporaryStatuses,
                LocalDateTime.now());

        if (!expiredBookings.isEmpty()) {
            List<Long> expiredIds = expiredBookings.stream()
                    .map(Booking::getId)
                    .toList();
            bookingRepository.updateStatusByIds(expiredIds, BookingStatus.CANCELLED);
        }
    }
}
