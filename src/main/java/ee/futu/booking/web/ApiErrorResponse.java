package ee.futu.booking.web;

import java.time.Instant;

public record ApiErrorResponse(
        int status,
        String code,
        String message,
        String path,
        Instant timestamp) {
}

