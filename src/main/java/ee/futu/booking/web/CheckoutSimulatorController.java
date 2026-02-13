package ee.futu.booking.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class CheckoutSimulatorController {

    private final String frontendUrl;

    public CheckoutSimulatorController(@Value("${app.frontend-url:/}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/checkout/{paymentReference}")
    @ResponseBody
    public String checkoutPage(@PathVariable String paymentReference) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Payment Simulator</title>\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }\n"
                +
                "        h1 { color: #333; }\n" +
                "        .payment-ref { background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; }\n"
                +
                "        button { padding: 12px 24px; margin: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }\n"
                +
                "        .success { background: #28a745; color: white; }\n" +
                "        .failed { background: #dc3545; color: white; }\n" +
                "        .result { margin-top: 20px; padding: 10px; border-radius: 5px; }\n" +
                "        .success-result { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }\n" +
                "        .error-result { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <h1>Payment Simulator</h1>\n" +
                "    <p>Payment Reference:</p>\n" +
                "    <div class=\"payment-ref\">" + paymentReference + "</div>\n" +
                "    \n" +
                "    <button class=\"success\" onclick=\"simulatePayment('PAID')\">Pay Success</button>\n" +
                "    <button class=\"failed\" onclick=\"simulatePayment('FAILED')\">Pay Failed</button>\n" +
                "    \n" +
                "    <div id=\"result\" class=\"result\" style=\"display: none;\"></div>\n" +
                "    \n" +
                "    <script>\n" +
                "        async function simulatePayment(status) {\n" +
                "            const resultDiv = document.getElementById('result');\n" +
                "            resultDiv.style.display = 'block';\n" +
                "            resultDiv.className = 'result';\n" +
                "            resultDiv.innerHTML = 'Processing...';\n" +
                "            \n" +
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
                "                \n" +
                "                if (response.ok) {\n" +
                "                    resultDiv.className = 'result success-result';\n" +
                "                    resultDiv.innerHTML = 'Payment processed successfully! Status: ' + status;\n" +
                "                    resultDiv.innerHTML += '<br><br><a href=\"" + frontendUrl
                + "\" style=\"color: #007bff; text-decoration: none; font-weight: bold;\">Return to booking page</a>';\n"
                +
                "                } else {\n" +
                "                    const errorText = await response.text();\n" +
                "                    resultDiv.className = 'result error-result';\n" +
                "                    resultDiv.innerHTML = 'Payment failed: ' + errorText;\n" +
                "                }\n" +
                "            } catch (error) {\n" +
                "                resultDiv.className = 'result error-result';\n" +
                "                resultDiv.innerHTML = 'Network error: ' + error.message;\n" +
                "            }\n" +
                "        }\n" +
                "    </script>\n" +
                "</body>\n" +
                "</html>";
    }
}
