package ee.futu.booking.web;

import jakarta.validation.constraints.NotBlank;

public class PaymentWebhookRequest {

    @NotBlank
    private String paymentReference;

    @NotBlank
    private String event;

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
