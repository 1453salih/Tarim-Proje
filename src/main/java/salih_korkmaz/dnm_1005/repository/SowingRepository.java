package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import salih_korkmaz.dnm_1005.entity.Sowing;

import java.util.List;

public interface SowingRepository extends JpaRepository<Sowing, Long> {

    @Query("SELECT s FROM Sowing s WHERE s.land.user.id = :userId")
    List<Sowing> findByUserId(@Param("userId") Long userId);

}
