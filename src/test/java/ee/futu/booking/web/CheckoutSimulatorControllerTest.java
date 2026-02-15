package ee.futu.booking.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CheckoutSimulatorController.class)
@TestPropertySource(properties = "app.frontend-url=http://localhost:5173")
class CheckoutSimulatorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void checkoutPage_includesStatusRedirectWithBookingId() throws Exception {
        mockMvc.perform(get("/checkout/ref-123")
                        .param("bookingId", "77"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("window.location.assign('http://localhost:5173/status?bookingId=77');")));
    }
}

