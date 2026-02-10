package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.web.AvailabilityResponse;
import ee.futu.booking.web.SlotInfo;
import ee.futu.booking.web.SlotStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    private final BookingRepository bookingRepository;

    public AvailabilityService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public AvailabilityResponse getAvailability(Long roomId, LocalDate date) {
        List<Booking> blockingBookings = getBlockingBookings(roomId, date);
        List<SlotInfo> slots = generateSlots(date, blockingBookings);

        return new AvailabilityResponse(date, roomId, slots);
    }

    private List<Booking> getBlockingBookings(Long roomId, LocalDate date) {
        // Use new method that considers DRAFT expiry
        return bookingRepository.findActiveBookings(
                roomId, date, BookingStatus.CONFIRMED, BookingStatus.DRAFT, LocalDateTime.now());
    }

    private List<SlotInfo> generateSlots(LocalDate date, List<Booking> blockingBookings) {
        List<SlotInfo> slots = new ArrayList<>();
        List<SlotRules.SlotDef> slotDefs = SlotRules.allowedSlotsFor(date);
        int priceCents = SlotRules.priceCentsFor(date);

        for (SlotRules.SlotDef slotDef : slotDefs) {
            LocalTime slotStart = slotDef.getStartTime();
            LocalTime slotEnd = slotDef.getEndTime();
            SlotStatus status = isSlotAvailable(slotStart, slotEnd, blockingBookings)
                    ? SlotStatus.AVAILABLE
                    : SlotStatus.UNAVAILABLE;

            slots.add(new SlotInfo(slotStart, slotEnd, status, priceCents));
        }

        return slots;
    }

    private boolean isSlotAvailable(LocalTime slotStart, LocalTime slotEnd, List<Booking> bookings) {
        return bookings.stream()
                .noneMatch(booking -> hasOverlap(slotStart, slotEnd, booking));
    }

    private boolean hasOverlap(LocalTime slotStart, LocalTime slotEnd, Booking booking) {
        LocalTime bookingStart = booking.getStartTime();
        LocalTime bookingEnd = booking.getEndTime();

        // Add 30-minute cleanup buffer to booking end time
        LocalTime bookingBlockingEnd = SlotRules.getBookingBlockingEnd(bookingEnd);

        // Overlap definition: slotStart < bookingBlockingEnd AND slotEnd > bookingStart
        return slotStart.isBefore(bookingBlockingEnd) && slotEnd.isAfter(bookingStart);
    }
}