package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import ee.futu.booking.web.RescheduleRequest;
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
class BookingRescheduleIntegrationTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Long roomId;
    private LocalDate mondayDate;
    private LocalDate fridayDate;
    private Room room;

    @BeforeEach
    void setUp() {
        roomId = 1L;
        mondayDate = LocalDate.of(2024, 1, 15); // Monday
        fridayDate = LocalDate.of(2024, 1, 19); // Friday

        room = new Room();
        room.setId(roomId);
        room.setName("Test Room");
        room.setActive(true);
    }

    @Test
    void rescheduleBooking_confirmedBooking_updatesAllFields() {
        // Given
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setRoom(room);
        existingBooking.setBookingDate(mondayDate);
        existingBooking.setStartTime(LocalTime.of(16, 0));
        existingBooking.setEndTime(LocalTime.of(18, 30));
        existingBooking.setStatus(BookingStatus.CONFIRMED);
        existingBooking.setTotalPriceCents(21000);

        RescheduleRequest rescheduleRequest = new RescheduleRequest();
        rescheduleRequest.setDate(fridayDate);
        rescheduleRequest.setStartTime(LocalTime.of(19, 0));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.findByRoomIdAndBookingDateAndStatusIn(any(), any(), any()))
                .thenReturn(java.util.Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        var response = bookingService.rescheduleBooking(1L, rescheduleRequest);

        // Then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
        assertThat(response.getDate()).isEqualTo(fridayDate);
        assertThat(response.getStartTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(response.getEndTime()).isEqualTo(LocalTime.of(21, 30));
        assertThat(response.getPriceCents()).isEqualTo(26000); // Friday pricing
        
        verify(bookingRepository).save(existingBooking);
    }

    @Test
    void rescheduleBooking_notFound_throwsException() {
        // Given
        RescheduleRequest rescheduleRequest = new RescheduleRequest();
        rescheduleRequest.setDate(mondayDate);
        rescheduleRequest.setStartTime(LocalTime.of(16, 0));

        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
                () -> bookingService.rescheduleBooking(1L, rescheduleRequest));
        assertThat(exception.getReason()).isEqualTo("Booking not found");
    }

    @Test
    void rescheduleBooking_cancelledBooking_throwsException() {
        // Given
        Booking cancelledBooking = new Booking();
        cancelledBooking.setId(1L);
        cancelledBooking.setRoom(room);
        cancelledBooking.setBookingDate(mondayDate);
        cancelledBooking.setStartTime(LocalTime.of(16, 0));
        cancelledBooking.setEndTime(LocalTime.of(18, 30));
        cancelledBooking.setStatus(BookingStatus.CANCELLED);

        RescheduleRequest rescheduleRequest = new RescheduleRequest();
        rescheduleRequest.setDate(mondayDate);
        rescheduleRequest.setStartTime(LocalTime.of(19, 0));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(cancelledBooking));

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
                () -> bookingService.rescheduleBooking(1L, rescheduleRequest));
        assertThat(exception.getReason()).isEqualTo("BOOKING_NOT_RESCHEDULABLE");
    }
}
