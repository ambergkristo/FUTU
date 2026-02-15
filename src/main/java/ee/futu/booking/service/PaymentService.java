package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.web.StartPaymentRequest;
import ee.futu.booking.web.StartPaymentResponse;
import ee.futu.booking.web.PaymentWebhookRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;

    public PaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public StartPaymentResponse startPayment(StartPaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BOOKING_NOT_FOUND"));

        if (booking.getStatus() != BookingStatus.DRAFT || isExpired(booking)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BOOKING_NOT_PAYABLE");
        }

        // Transition to PENDING_PAYMENT
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        String paymentReference = UUID.randomUUID().toString();
        booking.setPaymentReference(paymentReference);
        booking.setPaymentProvider(request.getProvider());
        // Keep existing expiresAt to avoid complexity

        bookingRepository.save(booking);

        return new StartPaymentResponse(
                booking.getId(),
                booking.getStatus().name(),
                paymentReference,
                "/checkout/" + paymentReference + "?bookingId=" + booking.getId(),
                booking.getExpiresAt());
    }

    public void handlePaymentWebhook(PaymentWebhookRequest request) {
        Booking booking = bookingRepository.findByPaymentReference(request.getPaymentReference())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BOOKING_NOT_FOUND"));

        // Idempotent: ignore if already in final state
        if (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.CANCELLED) {
            return;
        }
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BOOKING_NOT_AWAITING_PAYMENT");
        }

        switch (request.getEvent()) {
            case "PAID":
                if (isExpired(booking)) {
                    // Payment arrived after expiry - cancel
                    booking.setStatus(BookingStatus.CANCELLED);
                } else {
                    // Valid payment - confirm
                    booking.setStatus(BookingStatus.CONFIRMED);
                    booking.setExpiresAt(null); // Remove expiry on confirmation
                }
                break;
            case "FAILED":
            case "CANCELLED":
                booking.setStatus(BookingStatus.CANCELLED);
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "UNKNOWN_WEBHOOK_EVENT");
        }

        bookingRepository.save(booking);
    }

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

    private boolean isExpired(Booking booking) {
        return booking.getExpiresAt() == null || booking.getExpiresAt().isBefore(LocalDateTime.now());
    }
}
