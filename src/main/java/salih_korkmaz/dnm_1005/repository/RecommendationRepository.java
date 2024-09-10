package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Recommendation;

import java.util.List;
import java.util.Optional;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByLocality(Locality locality);
    Optional<Recommendation> findByPlantAndLocality(Plant plant, Locality locality);
}
