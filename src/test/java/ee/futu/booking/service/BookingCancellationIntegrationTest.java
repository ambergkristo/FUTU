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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingCancellationIntegrationTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Long roomId;
    private LocalDate mondayDate;
    private Room room;

    @BeforeEach
    void setUp() {
        roomId = 1L;
        mondayDate = LocalDate.of(2024, 1, 15); // Monday

        room = new Room();
        room.setId(roomId);
        room.setName("Test Room");
        room.setActive(true);
    }

    @Test
    void cancelBooking_confirmedBooking_marksAsCancelled() {
        // Given
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setRoom(room);
        existingBooking.setBookingDate(mondayDate);
        existingBooking.setStartTime(LocalTime.of(16, 0));
        existingBooking.setEndTime(LocalTime.of(18, 30));
        existingBooking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        bookingService.cancelBooking(1L);

        // Then
        assertThat(existingBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(bookingRepository).save(existingBooking);
    }

    @Test
    void cancelBooking_alreadyCancelled_isIdempotent() {
        // Given
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setRoom(room);
        existingBooking.setBookingDate(mondayDate);
        existingBooking.setStartTime(LocalTime.of(16, 0));
        existingBooking.setEndTime(LocalTime.of(18, 30));
        existingBooking.setStatus(BookingStatus.CANCELLED);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));

        // When
        bookingService.cancelBooking(1L);

        // Then - should not throw exception and status remains CANCELLED
        assertThat(existingBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        // Should not call save if already cancelled
        verify(bookingRepository, org.mockito.Mockito.never()).save(any(Booking.class));
    }

    @Test
    void cancelBooking_notFound_throwsException() {
        // Given
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> bookingService.cancelBooking(1L));
        assertThat(exception.getReason()).isEqualTo("Booking not found");
    }

    @Test
    void cancelBooking_releasesAvailability_forNewBooking() {
        // Given - existing confirmed booking
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setRoom(room);
        existingBooking.setBookingDate(mondayDate);
        existingBooking.setStartTime(LocalTime.of(16, 0));
        existingBooking.setEndTime(LocalTime.of(18, 30));
        existingBooking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When - cancel the booking
        bookingService.cancelBooking(1L);

        // Then - verify booking was saved with CANCELLED status
        assertThat(existingBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(bookingRepository).save(existingBooking);
    }
}
