package ee.futu.booking.domain.booking;

public enum BookingStatus {
    CREATED,
    DRAFT,
    PENDING_PAYMENT,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW;

    public boolean blocksAvailability() {
        return this == CONFIRMED || this == DRAFT || this == PENDING_PAYMENT;
    }
}
