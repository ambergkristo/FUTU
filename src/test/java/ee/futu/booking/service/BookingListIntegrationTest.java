package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import ee.futu.booking.web.BookingRequest;
import ee.futu.booking.web.BookingResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingListIntegrationTest {

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
    void listBookings_createTwoBookingsCancelOne_returnsBothSorted() {
        // Given - create two bookings
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setRoom(room);
        booking1.setBookingDate(mondayDate);
        booking1.setStartTime(LocalTime.of(16, 0));
        booking1.setEndTime(LocalTime.of(18, 30));
        booking1.setStatus(BookingStatus.CONFIRMED);
        booking1.setCustomerName("User 1");
        booking1.setCustomerEmail("user1@example.com");
        booking1.setCustomerPhone("+3725000001");

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setRoom(room);
        booking2.setBookingDate(mondayDate);
        booking2.setStartTime(LocalTime.of(19, 0));
        booking2.setEndTime(LocalTime.of(21, 30));
        booking2.setStatus(BookingStatus.CONFIRMED);
        booking2.setCustomerName("User 2");
        booking2.setCustomerEmail("user2@example.com");
        booking2.setCustomerPhone("+3725000002");

        // Cancel one booking
        booking2.setStatus(BookingStatus.CANCELLED);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateOrderByStartTime(roomId, mondayDate))
                .thenReturn(Arrays.asList(booking1, booking2)); // Sorted by startTime

        // When
        var responses = bookingService.listBookings(roomId, mondayDate);

        // Then
        assertThat(responses).hasSize(2);
        
        // First booking (16:00) - CONFIRMED
        assertThat(responses.get(0).getId()).isEqualTo(1L);
        assertThat(responses.get(0).getStatus()).isEqualTo("CONFIRMED");
        assertThat(responses.get(0).getStartTime()).isEqualTo(LocalTime.of(16, 0));
        assertThat(responses.get(0).getEndTime()).isEqualTo(LocalTime.of(18, 30));
        assertThat(responses.get(0).getCustomerName()).isEqualTo("User 1");
        assertThat(responses.get(0).getCustomerEmail()).isEqualTo("user1@example.com");
        assertThat(responses.get(0).getCustomerPhone()).isEqualTo("+3725000001");
        
        // Second booking (19:00) - CANCELLED
        assertThat(responses.get(1).getId()).isEqualTo(2L);
        assertThat(responses.get(1).getStatus()).isEqualTo("CANCELLED");
        assertThat(responses.get(1).getStartTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(responses.get(1).getEndTime()).isEqualTo(LocalTime.of(21, 30));
        assertThat(responses.get(1).getCustomerName()).isEqualTo("User 2");
        assertThat(responses.get(1).getCustomerEmail()).isEqualTo("user2@example.com");
        assertThat(responses.get(1).getCustomerPhone()).isEqualTo("+3725000002");
    }

    @Test
    void listBookings_emptyList_returnsEmpty() {
        // Given
        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateOrderByStartTime(roomId, mondayDate))
                .thenReturn(Collections.emptyList());

        // When
        var responses = bookingService.listBookings(roomId, mondayDate);

        // Then
        assertThat(responses).isEmpty();
    }

    @Test
    void listBookings_roomNotFound_throwsException() {
        // Given
        when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
                () -> bookingService.listBookings(roomId, mondayDate));
        assertThat(exception.getReason()).isEqualTo("Room not found");
    }
}
