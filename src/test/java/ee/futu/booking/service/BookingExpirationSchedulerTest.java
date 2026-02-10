package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingExpirationSchedulerTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private Long roomId;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        roomId = 1L;
        now = LocalDateTime.of(2024, 1, 15, 10, 0); // Fixed time for testing
    }

    @Test
    void cancelExpiredDrafts_cancelsExpiredDrafts() {
        // Given - expired draft bookings
        Booking expiredDraft1 = new Booking();
        expiredDraft1.setId(1L);
        expiredDraft1.setStatus(BookingStatus.DRAFT);
        expiredDraft1.setExpiresAt(now.minusMinutes(1)); // Expired 1 minute ago

        Booking expiredDraft2 = new Booking();
        expiredDraft2.setId(2L);
        expiredDraft2.setStatus(BookingStatus.DRAFT);
        expiredDraft2.setExpiresAt(now.minusMinutes(5)); // Expired 5 minutes ago

        when(bookingRepository.findExpiredDrafts(eq(BookingStatus.DRAFT), any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(expiredDraft1, expiredDraft2));

        when(bookingRepository.updateStatusByIds(eq(Arrays.asList(1L, 2L)), eq(BookingStatus.CANCELLED)))
                .thenReturn(2);

        // When
        bookingService.cancelExpiredDrafts();

        // Then
        verify(bookingRepository).findExpiredDrafts(eq(BookingStatus.DRAFT), any(LocalDateTime.class));
        verify(bookingRepository).updateStatusByIds(Arrays.asList(1L, 2L), BookingStatus.CANCELLED);
    }

    @Test
    void cancelExpiredDrafts_noExpiredDrafts_doesNothing() {
        // Given - no expired drafts
        when(bookingRepository.findExpiredDrafts(eq(BookingStatus.DRAFT), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        // When
        bookingService.cancelExpiredDrafts();

        // Then
        verify(bookingRepository).findExpiredDrafts(eq(BookingStatus.DRAFT), any(LocalDateTime.class));
        verify(bookingRepository, org.mockito.Mockito.never()).updateStatusByIds(org.mockito.ArgumentMatchers.any(),
                eq(BookingStatus.CANCELLED));
    }
}
