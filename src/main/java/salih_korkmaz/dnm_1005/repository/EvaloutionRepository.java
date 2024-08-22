package salih_korkmaz.dnm_1005.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.Evaloution;

import java.util.Optional;

public interface EvaloutionRepository extends JpaRepository<Evaloution,Long> {
    void deleteByHarvestId(Long harvestId);
    Optional<Evaloution> findByHarvestId(Long harvestId);
}
