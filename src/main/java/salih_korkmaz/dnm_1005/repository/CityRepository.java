package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.City;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findByCode(int code);
}
