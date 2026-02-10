package ee.futu.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FutuBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FutuBookingApplication.class, args);
    }
}
