package ee.futu.booking.service;

import ee.futu.booking.domain.booking.Booking;
import ee.futu.booking.domain.booking.BookingRepository;
import ee.futu.booking.domain.booking.BookingStatus;
import ee.futu.booking.domain.room.Room;
import ee.futu.booking.domain.room.RoomRepository;
import ee.futu.booking.web.BookingRequest;
import ee.futu.booking.web.BookingResponse;
import ee.futu.booking.web.ConfirmRequest;
import ee.futu.booking.web.HoldRequest;
import ee.futu.booking.web.RescheduleRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public BookingResponse rescheduleBooking(Long bookingId, RescheduleRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Only CONFIRMED bookings can be rescheduled
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(BAD_REQUEST, "BOOKING_NOT_RESCHEDULABLE");
        }

        // Validate new slot time
        validateSlotTime(request.getDate(), request.getStartTime());

        // Compute new endTime and price
        LocalTime newEndTime = SlotRules.getEndTime(request.getStartTime());
        int newPriceCents = SlotRules.priceCentsFor(request.getDate());

        // Check for conflicts (exclude current booking)
        if (hasConflictExcluding(booking.getId(), booking.getRoom().getId(), request.getDate(), request.getStartTime(),
                newEndTime)) {
            throw new ResponseStatusException(CONFLICT, "BOOKING_OVERLAP");
        }

        // Update booking
        booking.setBookingDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(newEndTime);
        booking.setTotalPriceCents(newPriceCents);

        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse getBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));
        return mapToResponse(booking);
    }

    @Transactional
    public List<BookingResponse> listBookings(Long roomId, LocalDate date) {
        // Validate room exists
        roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));

        // Fetch all bookings for room and date (includes all statuses)
        List<Booking> bookings = bookingRepository.findByRoomIdAndBookingDateOrderByStartTime(roomId, date);

        // Map to response DTOs
        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse holdBooking(HoldRequest request) {
        // Validate room exists
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));

        // Validate slot time
        validateSlotTime(request.getDate(), request.getStartTime());

        // Compute endTime and price
        LocalTime endTime = SlotRules.getEndTime(request.getStartTime());
        int priceCents = SlotRules.priceCentsFor(request.getDate());

        // Check for conflicts with active bookings
        if (hasConflictWithActiveBookings(request.getRoomId(), request.getDate(), request.getStartTime(), endTime)) {
            throw new ResponseStatusException(CONFLICT, "BOOKING_OVERLAP");
        }

        // Create hold booking
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setBookingDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.DRAFT);
        booking.setTotalPriceCents(priceCents);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(15));

        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId, ConfirmRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Must be DRAFT and not expired
        if (booking.getStatus() != BookingStatus.DRAFT ||
                (booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new ResponseStatusException(BAD_REQUEST, "BOOKING_NOT_CONFIRMABLE");
        }

        // Transition to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        // Keep expiresAt for audit

        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    void cancelExpiredDrafts() {
        List<Booking> expiredDrafts = bookingRepository.findExpiredDrafts(
                BookingStatus.DRAFT, LocalDateTime.now());

        if (!expiredDrafts.isEmpty()) {
            List<Long> expiredIds = expiredDrafts.stream()
                    .map(Booking::getId)
                    .collect(Collectors.toList());

            bookingRepository.updateStatusByIds(expiredIds, BookingStatus.CANCELLED);
        }
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

    private boolean hasConflictExcluding(Long excludeBookingId, Long roomId, LocalDate date, LocalTime startTime,
            LocalTime endTime) {
        List<Booking> existingBookings = bookingRepository.findByRoomIdAndBookingDateAndStatusIn(
                roomId, date, Arrays.asList(BookingStatus.CONFIRMED));

        return existingBookings.stream()
                .filter(booking -> !booking.getId().equals(excludeBookingId))
                .anyMatch(booking -> hasOverlap(startTime, endTime, booking));
    }

    private boolean hasConflictWithActiveBookings(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> activeBookings = bookingRepository.findActiveBookings(
                roomId, date, BookingStatus.CONFIRMED, BookingStatus.DRAFT, LocalDateTime.now());

        return activeBookings.stream()
                .anyMatch(booking -> hasOverlap(startTime, endTime, booking));
    }

    private boolean hasOverlap(LocalTime newStart, LocalTime newEnd, Booking existingBooking) {
        LocalTime existingStart = existingBooking.getStartTime();
        LocalTime existingEnd = existingBooking.getEndTime();
        LocalTime existingBlockingEnd = SlotRules.getBookingBlockingEnd(existingEnd);

        // Overlap definition: newStart < existingBlockingEnd AND newEnd > existingStart
        return newStart.isBefore(existingBlockingEnd) && newEnd.isAfter(existingStart);
    }

    public BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setStatus(booking.getStatus().name());
        response.setDate(booking.getBookingDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setPriceCents(booking.getTotalPriceCents());
        response.setExpiresAt(booking.getExpiresAt());
        response.setCustomerName(booking.getCustomerName());
        response.setCustomerEmail(booking.getCustomerEmail());
        response.setCustomerPhone(booking.getCustomerPhone());
        return response;
    }
}
