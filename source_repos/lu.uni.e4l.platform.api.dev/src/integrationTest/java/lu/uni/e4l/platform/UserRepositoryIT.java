package lu.uni.e4l.platform;

import lu.uni.e4l.platform.model.User;
import lu.uni.e4l.platform.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional // Roll back DB changes after each test
class UserRepositoryIT {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldPersistAndLoadUser() {
        // given
        User user = new User();
        user.setEmail("integration@test.lu");
        user.setPassword("secret123");
        userRepository.save(user);

        // when
        User found = userRepository.findByEmail("integration@test.lu");

        // then
        assertThat(found).isNotNull();
        assertThat(found.getId()).isNotNull();
        assertThat(found.getEmail()).isEqualTo("integration@test.lu");
    }
}



// This test:
// Starts the full Spring context (@SpringBootTest).
// Uses H2 automatically
// Saves a User via UserRepository and reads it back, proving JPA + DB + Spring wiring all work.