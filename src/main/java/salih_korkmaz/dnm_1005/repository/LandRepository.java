package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import salih_korkmaz.dnm_1005.entity.Land;

public interface LandRepository extends JpaRepository<Land, Long>, JpaSpecificationExecutor<Land> {
    long countByUserId(Long userId);
}
