package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.District;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByCityCode(int cityCode);
}

