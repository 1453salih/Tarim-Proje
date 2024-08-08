package salih_korkmaz.dnm_1005.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.User;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUser(String username);
}
