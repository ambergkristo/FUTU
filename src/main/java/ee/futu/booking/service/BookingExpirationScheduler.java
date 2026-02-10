package ee.futu.booking.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingExpirationScheduler {

    private final BookingService bookingService;

    public BookingExpirationScheduler(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Scheduled(fixedDelay = 60000) // Every minute
    void cancelExpiredHolds() {
        bookingService.cancelExpiredDrafts();
    }
}
