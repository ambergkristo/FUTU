package ee.futu.booking.web;

import jakarta.validation.constraints.NotNull;

public class StartPaymentRequest {
    
    @NotNull
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
