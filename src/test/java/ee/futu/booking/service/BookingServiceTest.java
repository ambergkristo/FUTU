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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

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
    void createBooking_happyPath_createsConfirmedBooking() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId);
        request.setDate(mondayDate);
        request.setStartTime(LocalTime.of(16, 0));
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+3725000000");

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateAndStatusIn(eq(roomId), eq(mondayDate), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // When
        var response = bookingService.createBooking(request);

        // Then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
        assertThat(response.getDate()).isEqualTo(mondayDate);
        assertThat(response.getStartTime()).isEqualTo(LocalTime.of(16, 0));
        assertThat(response.getEndTime()).isEqualTo(LocalTime.of(18, 30));
        assertThat(response.getPriceCents()).isEqualTo(21000); // Monday pricing
        assertThat(response.getCustomerName()).isEqualTo("Test User");
        assertThat(response.getCustomerEmail()).isEqualTo("test@example.com");
        assertThat(response.getCustomerPhone()).isEqualTo("+3725000000");
    }

    @Test
    void createBooking_invalidStartTime_throwsException() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId);
        request.setDate(mondayDate);
        request.setStartTime(LocalTime.of(10, 0)); // Invalid for Monday
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+3725000000");

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        // When & Then
        assertThrows(ResponseStatusException.class, 
                () -> bookingService.createBooking(request));
    }

    @Test
    void createBooking_conflict_throwsException() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId);
        request.setDate(mondayDate);
        request.setStartTime(LocalTime.of(16, 0));
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+3725000000");

        // Existing booking that conflicts
        Booking existingBooking = new Booking();
        existingBooking.setId(2L);
        existingBooking.setRoom(room);
        existingBooking.setBookingDate(mondayDate);
        existingBooking.setStartTime(LocalTime.of(16, 0));
        existingBooking.setEndTime(LocalTime.of(18, 30));
        existingBooking.setStatus(BookingStatus.CONFIRMED);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateAndStatusIn(eq(roomId), eq(mondayDate), any()))
                .thenReturn(Arrays.asList(existingBooking));

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
                () -> bookingService.createBooking(request));
        assertThat(exception.getReason()).isEqualTo("BOOKING_OVERLAP");
    }

    @Test
    void createBooking_friday_stores26000Price() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId);
        request.setDate(fridayDate);
        request.setStartTime(LocalTime.of(16, 0));
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+3725000000");

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateAndStatusIn(eq(roomId), eq(fridayDate), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // When
        var response = bookingService.createBooking(request);

        // Then
        assertThat(response.getPriceCents()).isEqualTo(26000); // Friday pricing
    }

    @Test
    void createBooking_monday_stores21000Price() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId);
        request.setDate(mondayDate);
        request.setStartTime(LocalTime.of(16, 0));
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+3725000000");

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findByRoomIdAndBookingDateAndStatusIn(eq(roomId), eq(mondayDate), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // When
        var response = bookingService.createBooking(request);

        // Then
        assertThat(response.getPriceCents()).isEqualTo(21000); // Monday pricing
    }
}
