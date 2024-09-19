package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import salih_korkmaz.dnm_1005.entity.Land;

import java.util.List;


public interface LandRepository extends JpaRepository<Land, Long>, JpaSpecificationExecutor<Land> {
}
