package salih_korkmaz.dnm_1005.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.Evaluation;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation,Long> {
    Optional<Evaluation> findByHarvestId(Long harvestId);
    List<Evaluation> findByHarvestSowingLandUserId(Long userId);
}
