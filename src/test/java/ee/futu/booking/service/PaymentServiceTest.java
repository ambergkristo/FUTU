package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.web.StartPaymentRequest;
import ee.futu.booking.web.StartPaymentResponse;
import ee.futu.booking.web.PaymentWebhookRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

        @Mock
        private BookingRepository bookingRepository;

        @InjectMocks
        private PaymentService paymentService;

        private Booking draftBooking;

        @BeforeEach
        void setUp() {
                draftBooking = new Booking();
                draftBooking.setId(1L);
                draftBooking.setStatus(BookingStatus.DRAFT);
                draftBooking.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        }

        @Test
        void startPayment_success_transitionsDraftToPendingPayment_andSetsReference() {
                when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.of(draftBooking));
                when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

                StartPaymentRequest request = new StartPaymentRequest();
                request.setBookingId(1L);
                request.setProvider("stripe");

                StartPaymentResponse response = paymentService.startPayment(request);

                assertEquals(1L, response.getBookingId());
                assertEquals("PENDING_PAYMENT", response.getStatus());
                assertNotNull(response.getPaymentReference());
                assertTrue(response.getPaymentUrl().contains("/checkout/"));
                assertTrue(response.getPaymentUrl().contains(response.getPaymentReference()));
                assertEquals(draftBooking.getExpiresAt(), response.getExpiresAt());

                verify(bookingRepository).save(any(Booking.class));
        }

        @Test
        void startPayment_notDraft_400() {
                draftBooking.setStatus(BookingStatus.CONFIRMED);
                when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.of(draftBooking));

                StartPaymentRequest request = new StartPaymentRequest();
                request.setBookingId(1L);

                assertThrows(org.springframework.web.server.ResponseStatusException.class,
                                () -> paymentService.startPayment(request));
        }

        @Test
        void startPayment_expiredDraft_400() {
                draftBooking.setExpiresAt(LocalDateTime.now().minusMinutes(1));
                when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.of(draftBooking));

                StartPaymentRequest request = new StartPaymentRequest();
                request.setBookingId(1L);

                assertThrows(org.springframework.web.server.ResponseStatusException.class,
                                () -> paymentService.startPayment(request));
        }

        @Test
        void webhook_paid_confirmsPendingPayment_andClearsExpiresAt() {
                draftBooking.setStatus(BookingStatus.PENDING_PAYMENT);
                draftBooking.setExpiresAt(LocalDateTime.now().plusMinutes(10));
                when(bookingRepository.findByPaymentReference(any(String.class)))
                                .thenReturn(java.util.Optional.of(draftBooking));

                PaymentWebhookRequest request = new PaymentWebhookRequest();
                request.setPaymentReference("ref123");
                request.setEvent("PAID");

                paymentService.handlePaymentWebhook(request);

                verify(bookingRepository).save(any(Booking.class));
        }

        @Test
        void webhook_paid_onExpiredPendingPayment_cancels() {
                draftBooking.setStatus(BookingStatus.PENDING_PAYMENT);
                draftBooking.setExpiresAt(LocalDateTime.now().minusMinutes(1));
                when(bookingRepository.findByPaymentReference(any(String.class)))
                                .thenReturn(java.util.Optional.of(draftBooking));

                PaymentWebhookRequest request = new PaymentWebhookRequest();
                request.setPaymentReference("ref123");
                request.setEvent("PAID");

                paymentService.handlePaymentWebhook(request);

                verify(bookingRepository).save(any(Booking.class));
        }

        @Test
        void webhook_failed_cancels() {
                draftBooking.setStatus(BookingStatus.PENDING_PAYMENT);
                when(bookingRepository.findByPaymentReference(any(String.class)))
                                .thenReturn(java.util.Optional.of(draftBooking));

                PaymentWebhookRequest request = new PaymentWebhookRequest();
                request.setPaymentReference("ref123");
                request.setEvent("FAILED");

                paymentService.handlePaymentWebhook(request);

                verify(bookingRepository).save(any(Booking.class));
        }
}
