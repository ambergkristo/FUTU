package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.web.SlotStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private AvailabilityService availabilityService;

    private Long roomId;
    private LocalDate mondayDate;
    private LocalDate fridayDate;
    private LocalDate saturdayDate;
    private Room room;

    @BeforeEach
    void setUp() {
        roomId = 1L;
        mondayDate = LocalDate.of(2024, 1, 15); // Monday
        fridayDate = LocalDate.of(2024, 1, 19); // Friday
        saturdayDate = LocalDate.of(2024, 1, 20); // Saturday

        room = new Room();
        room.setId(roomId);
    }

    @Test
    void getAvailability_monday_returns2SlotsWith210Price() {
        // Given - no bookings for Monday
        when(bookingRepository.findActiveBookings(
                eq(roomId), eq(mondayDate), eq(BookingStatus.CONFIRMED), eq(BookingStatus.DRAFT),
                any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        // When
        var response = availabilityService.getAvailability(roomId, mondayDate);

        // Then
        assertThat(response.getDate()).isEqualTo(mondayDate);
        assertThat(response.getRoomId()).isEqualTo(roomId);
        assertThat(response.getSlots()).hasSize(2);

        // All slots should be available with 210 EUR price (Mon-Thu pricing)
        response.getSlots().forEach(slot -> {
            assertThat(slot.getStatus()).isEqualTo(SlotStatus.AVAILABLE);
            assertThat(slot.getPriceCents()).isEqualTo(21000);
        });

        // Verify weekday slot times
        assertThat(response.getSlots().get(0).getStartTime()).isEqualTo(LocalTime.of(16, 0));
        assertThat(response.getSlots().get(0).getEndTime()).isEqualTo(LocalTime.of(18, 30));
        assertThat(response.getSlots().get(1).getStartTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(response.getSlots().get(1).getEndTime()).isEqualTo(LocalTime.of(21, 30));
    }

    @Test
    void getAvailability_saturday_returns4SlotsWith260Price() {
        // Given - no bookings for Saturday
        when(bookingRepository.findActiveBookings(
                eq(roomId), eq(saturdayDate), eq(BookingStatus.CONFIRMED), eq(BookingStatus.DRAFT),
                any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        // When
        var response = availabilityService.getAvailability(roomId, saturdayDate);

        // Then
        assertThat(response.getDate()).isEqualTo(saturdayDate);
        assertThat(response.getRoomId()).isEqualTo(roomId);
        assertThat(response.getSlots()).hasSize(4);

        // All slots should be available with 260 EUR price (Fri-Sun pricing)
        response.getSlots().forEach(slot -> {
            assertThat(slot.getStatus()).isEqualTo(SlotStatus.AVAILABLE);
            assertThat(slot.getPriceCents()).isEqualTo(26000);
        });

        // Verify weekend slot times
        assertThat(response.getSlots().get(0).getStartTime()).isEqualTo(LocalTime.of(10, 0));
        assertThat(response.getSlots().get(0).getEndTime()).isEqualTo(LocalTime.of(12, 30));
        assertThat(response.getSlots().get(1).getStartTime()).isEqualTo(LocalTime.of(13, 0));
        assertThat(response.getSlots().get(1).getEndTime()).isEqualTo(LocalTime.of(15, 30));
        assertThat(response.getSlots().get(2).getStartTime()).isEqualTo(LocalTime.of(16, 0));
        assertThat(response.getSlots().get(2).getEndTime()).isEqualTo(LocalTime.of(18, 30));
        assertThat(response.getSlots().get(3).getStartTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(response.getSlots().get(3).getEndTime()).isEqualTo(LocalTime.of(21, 30));
    }

    @Test
    void getAvailability_friday_returns2SlotsWith260Price() {
        // Given - no bookings for Friday
        when(bookingRepository.findActiveBookings(
                eq(roomId), eq(fridayDate), eq(BookingStatus.CONFIRMED), eq(BookingStatus.DRAFT),
                any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        // When
        var response = availabilityService.getAvailability(roomId, fridayDate);

        // Then
        assertThat(response.getDate()).isEqualTo(fridayDate);
        assertThat(response.getRoomId()).isEqualTo(roomId);
        assertThat(response.getSlots()).hasSize(2);

        // All slots should be available with 260 EUR price (Fri-Sun pricing)
        response.getSlots().forEach(slot -> {
            assertThat(slot.getStatus()).isEqualTo(SlotStatus.AVAILABLE);
            assertThat(slot.getPriceCents()).isEqualTo(26000);
        });

        // Verify Friday uses weekday schedule (same as Monday) but weekend pricing
        assertThat(response.getSlots().get(0).getStartTime()).isEqualTo(LocalTime.of(16, 0));
        assertThat(response.getSlots().get(0).getEndTime()).isEqualTo(LocalTime.of(18, 30));
        assertThat(response.getSlots().get(1).getStartTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(response.getSlots().get(1).getEndTime()).isEqualTo(LocalTime.of(21, 30));
    }

    @Test
    void getAvailability_confirmedBookingInWeekdaySlot_onlyMatchingSlotUnavailable() {
        // Given - a confirmed booking exactly in weekday slot #1 (16:00-18:30)
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setRoom(room);
        booking.setBookingDate(mondayDate);
        booking.setStartTime(LocalTime.of(16, 0));
        booking.setEndTime(LocalTime.of(18, 30));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTotalPriceCents(21000);

        when(bookingRepository.findActiveBookings(
                eq(roomId), eq(mondayDate), eq(BookingStatus.CONFIRMED), eq(BookingStatus.DRAFT),
                any(LocalDateTime.class)))
                .thenReturn(List.of(booking));

        // When
        var response = availabilityService.getAvailability(roomId, mondayDate);

        // Then - only slot #1 should be unavailable, slot #2 should be available
        // (cleanup respected)
        assertThat(response.getSlots()).hasSize(2);
        assertThat(response.getSlots().get(0).getStatus()).isEqualTo(SlotStatus.UNAVAILABLE); // 16:00-18:30
        assertThat(response.getSlots().get(1).getStatus()).isEqualTo(SlotStatus.AVAILABLE); // 19:00-21:30 (cleanup
                                                                                            // respected)
        assertThat(response.getSlots().get(0).getPriceCents()).isEqualTo(21000);
        assertThat(response.getSlots().get(1).getPriceCents()).isEqualTo(21000);
    }

    @Test
    void getAvailability_nonBlockingStatus_allSlotsAvailable() {
        // Given - a booking with CREATED status (doesn't block availability for MVP)
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setRoom(room);
        booking.setBookingDate(mondayDate);
        booking.setStartTime(LocalTime.of(11, 0));
        booking.setEndTime(LocalTime.of(13, 0));
        booking.setStatus(BookingStatus.CREATED);
        booking.setTotalPriceCents(2500);

        when(bookingRepository.findActiveBookings(
                eq(roomId), eq(mondayDate), eq(BookingStatus.CONFIRMED), eq(BookingStatus.DRAFT),
                any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList()); // No blocking bookings

        // When
        var response = availabilityService.getAvailability(roomId, mondayDate);

        // Then - all slots should be available since CREATED doesn't block for MVP
        assertThat(response.getSlots()).hasSize(2);
        response.getSlots().forEach(slot -> {
            assertThat(slot.getStatus()).isEqualTo(SlotStatus.AVAILABLE);
            assertThat(slot.getPriceCents()).isEqualTo(21000);
        });
    }
}
