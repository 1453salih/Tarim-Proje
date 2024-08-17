package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.Locality;

import java.util.List;

public interface LocalityRepository extends JpaRepository<Locality, Long> {
    List<Locality> findByDistrictCode(long districtCode);
}