package ee.futu.booking.web;

import java.time.LocalDateTime;

public class StartPaymentResponse {

    private Long bookingId;
    private String status;
    private String paymentReference;
    private String paymentUrl;
    private LocalDateTime expiresAt;

    public StartPaymentResponse(Long bookingId, String status, String paymentReference, String paymentUrl,
            LocalDateTime expiresAt) {
        this.bookingId = bookingId;
        this.status = status;
        this.paymentReference = paymentReference;
        this.paymentUrl = paymentUrl;
        this.expiresAt = expiresAt;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
