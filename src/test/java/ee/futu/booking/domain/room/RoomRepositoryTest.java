package ee.futu.booking.domain.room;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RoomRepositoryTest {

    @Autowired
    private RoomRepository roomRepository;

    @Test
    void saveAndFindRoom() {
        Room room = new Room();
        room.setName("VR Room");
        room.setActive(true);

        Room saved = roomRepository.save(room);

        assertThat(saved.getId()).isNotNull();

        Room found = roomRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getName()).isEqualTo("VR Room");
        assertThat(found.getActive()).isTrue();
    }
}