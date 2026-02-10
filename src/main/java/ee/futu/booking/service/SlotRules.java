package ee.futu.booking.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

public class SlotRules {
    
    public static final int CLEANUP_MINUTES = 30;
    public static final int SLOT_DURATION_MINUTES = 150;
    
    public static class SlotDef {
        private final LocalTime startTime;
        private final LocalTime endTime;
        
        public SlotDef(LocalTime startTime, LocalTime endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
        }
        
        public LocalTime getStartTime() {
            return startTime;
        }
        
        public LocalTime getEndTime() {
            return endTime;
        }
    }
    
    public static List<SlotDef> allowedSlotsFor(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        boolean isWeekend = dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
        
        if (isWeekend) {
            // Weekend schedule: 4 slots
            return Arrays.asList(
                new SlotDef(LocalTime.of(10, 0), LocalTime.of(12, 30)),
                new SlotDef(LocalTime.of(13, 0), LocalTime.of(15, 30)),
                new SlotDef(LocalTime.of(16, 0), LocalTime.of(18, 30)),
                new SlotDef(LocalTime.of(19, 0), LocalTime.of(21, 30))
            );
        } else {
            // Weekday schedule (Mon-Fri): 2 slots
            return Arrays.asList(
                new SlotDef(LocalTime.of(16, 0), LocalTime.of(18, 30)),
                new SlotDef(LocalTime.of(19, 0), LocalTime.of(21, 30))
            );
        }
    }
    
    public static int priceCentsFor(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        boolean isExpensiveDay = dayOfWeek == DayOfWeek.FRIDAY || dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
        
        return isExpensiveDay ? 26000 : 21000;
    }
    
    public static LocalTime getEndTime(LocalTime startTime) {
        return startTime.plusMinutes(SLOT_DURATION_MINUTES);
    }
    
    public static LocalTime getBookingBlockingEnd(LocalTime endTime) {
        return endTime.plusMinutes(CLEANUP_MINUTES);
    }
}
