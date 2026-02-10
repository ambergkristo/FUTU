package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import ee.futu.booking.web.BookingRequest;
import ee.futu.booking.web.BookingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Validate room exists
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));

        // Validate slot time
        validateSlotTime(request.getDate(), request.getStartTime());

        // Compute endTime and price
        LocalTime endTime = SlotRules.getEndTime(request.getStartTime());
        int priceCents = SlotRules.priceCentsFor(request.getDate());

        // Check for conflicts
        if (hasConflict(request.getRoomId(), request.getDate(), request.getStartTime(), endTime)) {
            throw new ResponseStatusException(CONFLICT, "BOOKING_OVERLAP");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setBookingDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTotalPriceCents(priceCents);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());

        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));
        
        // Idempotent: if already cancelled, do nothing
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return;
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private void validateSlotTime(LocalDate date, LocalTime startTime) {
        List<SlotRules.SlotDef> allowedSlots = SlotRules.allowedSlotsFor(date);
        
        boolean isValidSlot = allowedSlots.stream()
                .anyMatch(slot -> slot.getStartTime().equals(startTime));
        
        if (!isValidSlot) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid slot time");
        }
    }

    private boolean hasConflict(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> existingBookings = bookingRepository.findByRoomIdAndBookingDateAndStatusIn(
                roomId, date, Arrays.asList(BookingStatus.CONFIRMED));
        
        return existingBookings.stream()
                .anyMatch(booking -> hasOverlap(startTime, endTime, booking));
    }

    private boolean hasOverlap(LocalTime newStart, LocalTime newEnd, Booking existingBooking) {
        LocalTime existingStart = existingBooking.getStartTime();
        LocalTime existingEnd = existingBooking.getEndTime();
        LocalTime existingBlockingEnd = SlotRules.getBookingBlockingEnd(existingEnd);

        // Overlap definition: newStart < existingBlockingEnd AND newEnd > existingStart
        return newStart.isBefore(existingBlockingEnd) && newEnd.isAfter(existingStart);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setStatus(booking.getStatus().name());
        response.setDate(booking.getBookingDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setPriceCents(booking.getTotalPriceCents());
        response.setCustomerName(booking.getCustomerName());
        response.setCustomerEmail(booking.getCustomerEmail());
        response.setCustomerPhone(booking.getCustomerPhone());
        return response;
    }
}
