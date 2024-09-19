package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import salih_korkmaz.dnm_1005.entity.Harvest;

public interface HarvestRepository extends JpaRepository<Harvest, Long>, JpaSpecificationExecutor<Harvest> {
    // SowingId'ye göre bir hasat kaydının var olup olmadığını kontrol eden metot
    boolean existsBySowingId(Long sowingId);
}
