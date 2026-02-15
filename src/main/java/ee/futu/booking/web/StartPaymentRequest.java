package ee.futu.booking.web;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StartPaymentRequest {
    
    @NotNull
    @Positive
    private Long bookingId;
    
    private String provider;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}
