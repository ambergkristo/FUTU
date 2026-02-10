package ee.futu.booking.domain.booking;

public enum BookingStatus {
    DRAFT,
    CREATED,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW;

    public boolean blocksAvailability() {
        return this == CONFIRMED || this == DRAFT;
    }
}
