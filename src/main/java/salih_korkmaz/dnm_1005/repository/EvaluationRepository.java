package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import salih_korkmaz.dnm_1005.entity.Evaluation;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    // Kullanıcının yaptığı hasatlardaki ürün miktarlarını en yüksek olandan itibaren alır.
    @Query("SELECT e FROM Evaluation e WHERE e.harvest.sowing.land.user.id = :userId ORDER BY e.productQuantity DESC")
    List<Evaluation> findTopHarvestsByUserId(@Param("userId") Long userId, Pageable pageable);
    Optional<Evaluation> findByHarvestId(Long harvestId);
    List<Evaluation> findByHarvestSowingLandUserId(Long userId);
}
