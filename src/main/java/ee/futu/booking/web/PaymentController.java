package ee.futu.booking.web;

import ee.futu.booking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartPaymentResponse> startPayment(@Valid @RequestBody StartPaymentRequest request) {
        StartPaymentResponse response = paymentService.startPayment(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handlePaymentWebhook(@Valid @RequestBody PaymentWebhookRequest request) {
        paymentService.handlePaymentWebhook(request);
        return ResponseEntity.ok().build();
    }
}
