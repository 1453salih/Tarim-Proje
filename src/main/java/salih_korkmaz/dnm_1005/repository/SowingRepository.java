package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import salih_korkmaz.dnm_1005.entity.Sowing;

import java.util.List;

public interface SowingRepository extends JpaRepository<Sowing, Long> {
    Page<Sowing> findByLandUserId(Long userId, Pageable pageable);
}
