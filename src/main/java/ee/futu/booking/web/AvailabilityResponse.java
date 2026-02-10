package ee.futu.booking.web;

import java.time.LocalDate;
import java.util.List;

public class AvailabilityResponse {
    private LocalDate date;
    private Long roomId;
    private List<SlotInfo> slots;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(LocalDate date, Long roomId, List<SlotInfo> slots) {
        this.date = date;
        this.roomId = roomId;
        this.slots = slots;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public List<SlotInfo> getSlots() {
        return slots;
    }

    public void setSlots(List<SlotInfo> slots) {
        this.slots = slots;
    }
}
