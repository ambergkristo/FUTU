package ee.futu.booking.web;

import java.time.LocalTime;

public class SlotInfo {
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
    private Integer priceCents;

    public SlotInfo() {
    }

    public SlotInfo(LocalTime startTime, LocalTime endTime, SlotStatus status, Integer priceCents) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.priceCents = priceCents;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }

    public Integer getPriceCents() {
        return priceCents;
    }

    public void setPriceCents(Integer priceCents) {
        this.priceCents = priceCents;
    }
}
