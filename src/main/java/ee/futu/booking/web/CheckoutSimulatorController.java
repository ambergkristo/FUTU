package ee.futu.booking.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class CheckoutSimulatorController {

    private final String frontendUrl;

    public CheckoutSimulatorController(@Value("${app.frontend-url:/}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/checkout/{paymentReference}")
    @ResponseBody
    public String checkoutPage(@PathVariable String paymentReference,
            @RequestParam("bookingId") Long bookingId,
            @RequestParam(value = "lang", required = false) String lang,
            @RequestHeader(value = "Accept-Language", required = false) String acceptLanguage) {
        if (bookingId == null || bookingId < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BOOKING_ID_INVALID");
        }

        String locale = resolveLocale(lang, acceptLanguage);
        String pageTitle = "ee".equals(locale) ? "Makse simulaator" : "Payment simulator";
        String paidLabel = "ee".equals(locale) ? "Makse onnistus" : "Pay success";
        String failedLabel = "ee".equals(locale) ? "Makse ebaonnestus" : "Pay failed";
        String statusUrl = buildStatusUrl(bookingId);

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>" + pageTitle + "</title>\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; max-width: 420px; margin: 40px auto; padding: 20px; }\n"
                +
                "        button { padding: 12px 24px; margin: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }\n"
                +
                "        .success { background: #28a745; color: white; }\n" +
                "        .failed { background: #dc3545; color: white; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <button class=\"success\" onclick=\"simulatePayment('PAID')\">" + paidLabel + "</button>\n" +
                "    <button class=\"failed\" onclick=\"simulatePayment('FAILED')\">" + failedLabel + "</button>\n" +
                "    <script>\n" +
                "        async function simulatePayment(status) {\n" +
                "            try {\n" +
                "                const response = await fetch('/api/payments/webhook', {\n" +
                "                    method: 'POST',\n" +
                "                    headers: {\n" +
                "                        'Content-Type': 'application/json',\n" +
                "                    },\n" +
                "                    body: JSON.stringify({\n" +
                "                        paymentReference: '" + paymentReference + "',\n" +
                "                        event: status\n" +
                "                    })\n" +
                "                });\n" +
                "            } catch (error) {\n" +
                "                console.error(error);\n" +
                "            } finally {\n" +
                "                window.location.assign('" + statusUrl + "');\n" +
                "            }\n" +
                "        }\n" +
                "    </script>\n" +
                "</body>\n" +
                "</html>";
    }

    private String resolveLocale(String lang, String acceptLanguage) {
        if (lang != null && lang.toLowerCase().startsWith("ee")) {
            return "ee";
        }
        if (lang != null && lang.toLowerCase().startsWith("en")) {
            return "en";
        }
        if (acceptLanguage != null && acceptLanguage.toLowerCase().startsWith("et")) {
            return "ee";
        }
        return "en";
    }

    private String buildStatusUrl(Long bookingId) {
        String base = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        return base + "/status?bookingId=" + bookingId;
    }
}
