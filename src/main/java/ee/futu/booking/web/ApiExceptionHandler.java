package ee.futu.booking.web;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatusException(
            ResponseStatusException ex,
            HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String reason = ex.getReason();
        String code = reason != null ? reason : "HTTP_" + status.value();
        String message = reason != null ? reason : status.getReasonPhrase();
        return build(status, code, message, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        FieldError firstError = ex.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = firstError != null && firstError.getDefaultMessage() != null
                ? firstError.getDefaultMessage()
                : "VALIDATION_FAILED";
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", message, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {
        String message = ex.getConstraintViolations().stream()
                .findFirst()
                .map(violation -> violation.getMessage())
                .orElse("VALIDATION_FAILED");
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", message, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {
        if (LocalDate.class.equals(ex.getRequiredType())) {
            return build(HttpStatus.BAD_REQUEST, "INVALID_DATE_FORMAT", "INVALID_DATE_FORMAT", request);
        }
        return build(HttpStatus.BAD_REQUEST, "INVALID_PARAMETER", "INVALID_PARAMETER", request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingParameter(
            MissingServletRequestParameterException ex,
            HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "MISSING_PARAMETER", "MISSING_PARAMETER", request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request) {
        if (isInvalidLocalDate(ex)) {
            return build(HttpStatus.BAD_REQUEST, "INVALID_DATE_FORMAT", "INVALID_DATE_FORMAT", request);
        }
        return build(HttpStatus.BAD_REQUEST, "INVALID_REQUEST_BODY", "INVALID_REQUEST_BODY", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(Exception ex, HttpServletRequest request) {
        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "INTERNAL_SERVER_ERROR",
                request);
    }

    private boolean isInvalidLocalDate(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (!(cause instanceof InvalidFormatException invalidFormatException)) {
            return false;
        }
        return LocalDate.class.equals(invalidFormatException.getTargetType());
    }

    private ResponseEntity<ApiErrorResponse> build(
            HttpStatus status,
            String code,
            String message,
            HttpServletRequest request) {
        ApiErrorResponse error = new ApiErrorResponse(
                status.value(),
                code,
                message,
                request.getRequestURI(),
                Instant.now());
        return ResponseEntity.status(status).body(error);
    }
}

